import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICreateProductDto, IProduct, IUpdateProductDto } from '../models/product.model';

/**
 * Repository Pattern para Products
 * Abstrai a camada de dados, facilitando troca futura para API real
 * Reutilizado do Products MFE para operações CRUD do Admin MFE
 */
@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/products'; // Will be set from environment

  /**
   * Busca todos os produtos
   */
  findAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.API_URL);
  }

  /**
   * Busca produto por ID
   */
  findById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.API_URL}/${id}`);
  }

  /**
   * Cria novo produto
   */
  create(dto: ICreateProductDto): Observable<IProduct> {
    return this.http.post<IProduct>(this.API_URL, dto);
  }

  /**
   * Atualiza produto existente
   */
  update(id: string, dto: IUpdateProductDto): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.API_URL}/${id}`, dto);
  }

  /**
   * Remove produto
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
