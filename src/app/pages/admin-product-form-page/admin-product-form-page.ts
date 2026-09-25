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

interface ICreateProductDto {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

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

  readonly isLoading = signal(false);
  readonly isEditMode = signal(false);
  readonly productId = signal<string | null>(null);

  readonly categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];

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

    this.store
      .select(() => ({}))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((product) => {
        if (product) {
          this.productModel.set(product as ICreateProductDto);
        } else {
          this.router.navigate(['/admin/products']);
        }
        this.isLoading.set(false);
      });
  }

  onSubmit(): void {
    this.isLoading.set(true);
    const formValue = this.productModel();

    if (this.isEditMode() && this.productId()) {
      // Update product through store
    } else {
      // Create product through store
    }

    // Simulate save
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/admin/products']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
