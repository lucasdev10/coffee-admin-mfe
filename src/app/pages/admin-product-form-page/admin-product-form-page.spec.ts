import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { AdminProductFormPageComponent } from './admin-product-form-page';
import { ProductRepository } from '../../repositories/product.repository';
import { IProduct, ICreateProductDto } from '../../models/product.model';

describe('AdminProductFormPageComponent', () => {
  let component: AdminProductFormPageComponent;
  let fixture: ComponentFixture<AdminProductFormPageComponent>;
  let store: MockStore;
  let repository: ProductRepository;
  let activatedRoute: ActivatedRoute;

  const mockProduct: IProduct = {
    id: 'product-id-1',
    name: 'Test Product',
    description: 'Test Description',
    category: 'Test Category',
    price: 10.5,
    stock: 5,
    image: 'test.jpg',
    rating: 4.5,
    createdAt: 1773778252,
    updatedAt: 1773778252,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductFormPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: {
            auth: {
              user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' },
              isAuthenticated: true,
              token: 'test-token',
              loading: false,
              error: null,
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    repository = TestBed.inject(ProductRepository);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode when no id is provided', () => {
    expect(component.isEditMode()).toBe(false);
    expect(component.productId()).toBeNull();
    expect(component.productModel()).toEqual({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
    });
  });

  it('should initialize form in edit mode when id is provided', async () => {
    // Reset and reconfigure with an id
    vi.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('product-id-1');
    vi.spyOn(repository, 'findById').mockReturnValue(of(mockProduct));

    // Create new component instance
    const newFixture = TestBed.createComponent(AdminProductFormPageComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    await newFixture.whenStable();

    expect(newComponent.isEditMode()).toBe(true);
    expect(newComponent.productId()).toBe('product-id-1');
    expect(repository.findById).toHaveBeenCalledWith('product-id-1');
  });

  it('should validate empty form fields', () => {
    const formModel = component.productModel();

    expect(formModel.name).toBe('');
    expect(formModel.description).toBe('');
    expect(formModel.category).toBe('');
  });

  it('should handle form submission for creating a product', () => {
    const formData: ICreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10.5,
      stock: 5,
      image: 'test.jpg',
    };

    component.productModel.set(formData);
    vi.spyOn(repository, 'create').mockReturnValue(of(mockProduct));

    component.onSubmit();

    expect(repository.create).toHaveBeenCalledWith(formData);
  });

  it('should handle form submission for updating a product', () => {
    // Set edit mode
    component.isEditMode.set(true);
    component.productId.set('product-id-1');

    const formData: ICreateProductDto = {
      name: 'Updated Product',
      description: 'Updated Description',
      category: 'Updated Category',
      price: 20.5,
      stock: 10,
      image: 'updated.jpg',
    };

    component.productModel.set(formData);
    vi.spyOn(repository, 'update').mockReturnValue(of(mockProduct));

    component.onSubmit();

    expect(repository.update).toHaveBeenCalledWith('product-id-1', formData);
  });

  it('should show error when form submission fails', () => {
    const formData: ICreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10.5,
      stock: 5,
      image: 'test.jpg',
    };

    component.productModel.set(formData);
    vi.spyOn(repository, 'create').mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    component.onSubmit();

    expect(component.error()).toBe('Failed to create product. Please try again.');
  });

  it('should show error when product load fails', async () => {
    // Reset and reconfigure with an id that fails to load
    vi.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('invalid-id');
    vi.spyOn(repository, 'findById').mockReturnValue(
      throwError(() => new Error('Not found')),
    );

    // Create new component instance
    const newFixture = TestBed.createComponent(AdminProductFormPageComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    await newFixture.whenStable();

    expect(newComponent.error()).toBe('Failed to load product. Please try again.');
  });

  it('should have predefined categories', () => {
    expect(component.categories).toEqual([
      'Electronics',
      'Clothing',
      'Food',
      'Books',
      'Other',
      'Coffee',
    ]);
  });

  it('should navigate back to products list on cancel', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onCancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/products']);
  });

  it('should show error when submitting empty form', () => {
    component.productModel.set({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
    });

    component.onSubmit();

    expect(component.error()).toBe('Please fill in all required fields.');
  });

  it('should set loading state during product creation', () => {
    const formData: ICreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10.5,
      stock: 5,
      image: 'test.jpg',
    };

    component.productModel.set(formData);
    vi.spyOn(repository, 'create').mockReturnValue(of(mockProduct));

    expect(component.isLoading()).toBe(false);
    component.onSubmit();
    expect(repository.create).toHaveBeenCalled();
  });
});
