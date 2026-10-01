import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductRepository } from './product.repository';
import { IProduct, ICreateProductDto, IUpdateProductDto } from '../models/product.model';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let httpMock: HttpTestingController;
  const API_URL = '/api/products';

  const mockProduct: IProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    image: '/assets/coffee.jpg',
    category: 'Coffee',
    stock: 5,
    rating: 4.5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductRepository],
    });
    repository = TestBed.inject(ProductRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('findAll', () => {
    it('should fetch all products', () => {
      const mockProducts = [mockProduct];
      repository.findAll().subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products[0]).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('findById', () => {
    it('should fetch product by id', () => {
      repository.findById('1').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle 404 error', () => {
      repository.findById('999').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        },
      );

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create new product', () => {
      const createDto: ICreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 15.99,
        image: '/assets/coffee.jpg',
        category: 'Coffee',
        stock: 20,
      };

      repository.create(createDto).subscribe((product) => {
        expect(product.name).toBe('New Product');
        expect(product.id).toBeDefined();
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush({ ...createDto, id: '2', rating: 0, createdAt: Date.now(), updatedAt: Date.now() });
    });
  });

  describe('update', () => {
    it('should update existing product', () => {
      const updateDto: IUpdateProductDto = {
        name: 'Updated Product',
        price: 12.99,
      };

      repository.update('1', updateDto).subscribe((product) => {
        expect(product.name).toBe('Updated Product');
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush({ ...mockProduct, ...updateDto });
    });

    it('should handle update error', () => {
      const updateDto: IUpdateProductDto = {
        name: 'Updated Product',
      };

      repository.update('999', updateDto).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        },
      );

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete product', () => {
      repository.delete('1').subscribe(() => {
        expect(true).toBe(true);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', () => {
      repository.delete('999').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        },
      );

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
