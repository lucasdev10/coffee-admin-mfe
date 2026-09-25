import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

interface IProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

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
    AsyncPipe,
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

  readonly products$ = of([] as IProduct[]);
  readonly isLoading$ = of(false);
  readonly error$ = of(null);

  readonly displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'actions'];

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    // Load products through shared store
  }

  onEdit(product: IProduct): void {
    this.router.navigate(['/admin/products/edit', product.id]);
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
        // Delete product through shared store
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
