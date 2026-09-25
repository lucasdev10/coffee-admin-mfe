import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AdminProductFormPageComponent } from './admin-product-form-page';

describe('AdminProductFormPageComponent', () => {
  let component: AdminProductFormPageComponent;
  let fixture: ComponentFixture<AdminProductFormPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductFormPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {},
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    await fixture.whenStable();
  });

  it('should invalidate the empty form', () => {
    // Arrange
    const form = component.productForm();

    // Act

    // Assert
    expect(form.valid()).toBeFalsy();
    expect(form.value()).toEqual({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
    });
  });

  it('should validate the negative price', () => {
    // Arrange
    const formModel = component.productModel;
    formModel.set({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: -10,
      stock: 5,
      image: 'test.jpg',
    });

    // Act

    // Assert
    expect(component.productForm().valid()).toBeFalsy();
    expect(component.productForm.price().errors()[0].message).toBe('Minimum of 00.1');
  });

  it('should have correct categories', () => {
    expect(component.categories).toEqual([
      'Electronics',
      'Clothing',
      'Food',
      'Books',
      'Other',
    ]);
  });
});
