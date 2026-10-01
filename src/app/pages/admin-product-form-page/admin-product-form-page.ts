import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICreateProductDto, IUpdateProductDto } from '../../models/product.model';
import { ProductRepository } from '../../repositories/product.repository';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-product-form-page.html',
  styleUrl: './admin-product-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminProductFormPageComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productRepository = inject(ProductRepository);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly productId = signal<string | null>(null);

  readonly categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other', 'Coffee'];

  readonly productModel = signal<ICreateProductDto>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
  });

  readonly canSubmit = signal(false);

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productRepository
      .findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.productModel.set({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: product.image,
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.error.set('Failed to load product. Please try again.');
          this.isLoading.set(false);
          setTimeout(() => {
            this.router.navigate(['/admin/products']);
          }, 1500);
        },
      });
  }

  onSubmit(): void {
    if (!this.productModel()) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    const formValue = this.productModel();

    if (this.isEditMode() && this.productId()) {
      // Update product
      const updateDto: IUpdateProductDto = {
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        price: formValue.price,
        stock: formValue.stock,
        image: formValue.image,
      };

      this.productRepository
        .update(this.productId()!, updateDto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            console.error('Error updating product:', err);
            this.error.set('Failed to update product. Please try again.');
            this.isLoading.set(false);
          },
        });
    } else {
      // Create product
      this.productRepository
        .create(formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            console.error('Error creating product:', err);
            this.error.set('Failed to create product. Please try again.');
            this.isLoading.set(false);
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
