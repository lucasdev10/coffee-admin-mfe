import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Observable } from 'rxjs';
import { AdminProductsPageComponent } from './admin-products-page';
import { ProductRepository } from '../../repositories/product.repository';
import { IProduct, ICreateProductDto } from '../../models/product.model';
import { signal } from '@angular/core';

describe('AdminProductsPageComponent', () => {
  let component: AdminProductsPageComponent;
  let fixture: ComponentFixture<AdminProductsPageComponent>;
  let store: MockStore;
  let repository: ProductRepository;
  let mockDialog: { open: ReturnType<typeof vi.fn> };
  let router: Router;

  const mockNewProduct: ICreateProductDto = {
    name: 'test',
    description: 'test',
    price: 10,
    image: '',
    category: 'test',
    stock: 10,
  };

  const mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 29.99,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-2',
      name: 'Low Stock Product',
      description: 'Product with low stock',
      price: 19.99,
      image: '/assets/images/product.jpg',
      category: 'Electronics',
      stock: 5,
      rating: 4.0,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-3',
      name: 'Out of Stock Product',
      description: 'Product out of stock',
      price: 39.99,
      image: '/assets/images/product2.jpg',
      category: 'Clothing',
      stock: 0,
      rating: 3.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
  ];

  beforeEach(async () => {
    mockDialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AdminProductsPageComponent],
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
        { provide: MatDialog, useValue: mockDialog },
      ],
    })
      .overrideProvider(MatDialog, { useValue: mockDialog })
      .compileComponents();

    repository = TestBed.inject(ProductRepository);
    vi.spyOn(repository, 'findAll').mockReturnValue(of(mockProducts));

    fixture = TestBed.createComponent(AdminProductsPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    expect(repository.findAll).toHaveBeenCalled();
    expect(component.products().length).toBe(3);
    expect(component.products()).toEqual(mockProducts);
  });

  it('should set loading state while fetching products', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should navigate to edit page when onEdit is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const testProduct = mockProducts[0];

    component.onEdit(testProduct);

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/products', testProduct.id, 'edit']);
  });

  it('should delete product when dialog is confirmed', () => {
    const mockDialogRef = {
      afterClosed: () => of(true),
      close: vi.fn(),
    } as any;
    mockDialog.open.mockReturnValue(mockDialogRef);

    vi.spyOn(repository, 'delete').mockReturnValue(of(undefined));
    vi.spyOn(repository, 'findAll').mockReturnValue(
      of(mockProducts.filter((p) => p.id !== mockProducts[0].id)),
    );

    component.onDelete(mockProducts[0]);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(repository.delete).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('should not delete product when dialog is cancelled', () => {
    const mockDialogRef = {
      afterClosed: () => of(false),
      close: vi.fn(),
    } as any;
    mockDialog.open.mockReturnValue(mockDialogRef);

    const deleteProductSpy = vi.spyOn(repository, 'delete');

    component.onDelete(mockProducts[0]);

    expect(deleteProductSpy).not.toHaveBeenCalled();
  });

  it('should return correct stock class for out of stock', () => {
    const stockClass = component.getStockClass(0);
    expect(stockClass).toBe('out-of-stock');
  });

  it('should return correct stock class for low stock', () => {
    const stockClass = component.getStockClass(5);
    expect(stockClass).toBe('low-stock');
  });

  it('should return correct stock class for in stock', () => {
    const stockClass = component.getStockClass(50);
    expect(stockClass).toBe('in-stock');
  });

  it('should track products by id', () => {
    const testProduct = mockProducts[0];
    const trackId = component.trackByProductId(0, testProduct);
    expect(trackId).toBe(testProduct.id);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'image',
      'name',
      'category',
      'price',
      'stock',
      'actions',
    ]);
  });

  it('should handle error when loading products fails', async () => {
    const error = new Error('Network error');
    vi.spyOn(repository, 'findAll').mockReturnValue(
      new Observable((observer) => observer.error(error)),
    );

    // Create a new component instance within the TestBed injection context
    const newFixture = TestBed.createComponent(AdminProductsPageComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    await newFixture.whenStable();

    expect(newComponent.error()).toBe('Failed to load products. Please try again.');
  });

  it('should reload products list after successful deletion', () => {
    const mockDialogRef = {
      afterClosed: () => of(true),
      close: vi.fn(),
    } as any;
    mockDialog.open.mockReturnValue(mockDialogRef);

    vi.spyOn(repository, 'delete').mockReturnValue(of(undefined));
    const loadProductsSpy = vi.spyOn(component, 'loadProducts');

    component.onDelete(mockProducts[0]);

    expect(loadProductsSpy).toHaveBeenCalled();
  });
});
