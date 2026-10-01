import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { IProduct } from '../../models/product.model';
import { ProductRepository } from '../../repositories/product.repository';

@Component({
  selector: 'app-admin-products-page',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    RouterLink,
    CurrencyPipe,
  ],
  templateUrl: './admin-products-page.html',
  styleUrl: './admin-products-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminProductsPageComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly productRepository = inject(ProductRepository);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly products = signal<IProduct[]>([]);

  // Create observables from signals for template
  readonly isLoading$ = computed(() => this.isLoading());
  readonly error$ = computed(() => this.error());
  readonly products$ = computed(() => this.products());

  readonly displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'actions'];

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productRepository
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.error.set('Failed to load products. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  onEdit(product: IProduct): void {
    this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  onDelete(product: IProduct): void {
    const dialogRef = this.dialog.open(Object, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the product "${product.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoading.set(true);
        this.productRepository
          .delete(product.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              // Reload products list after deletion
              this.loadProducts();
            },
            error: (err) => {
              console.error('Error deleting product:', err);
              this.error.set('Failed to delete product. Please try again.');
              this.isLoading.set(false);
            },
          });
      }
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  }

  trackByProductId(index: number, product: IProduct): string {
    return product.id;
  }
}
