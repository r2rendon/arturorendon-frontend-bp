import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetProducts, Product } from '../types/api';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getProduct(id: string) {
    return this.http.get<Product>(`${API_ENDPOINTS.getProducts}/${id}`);
  }

  getProducts() {
    return this.http.get<GetProducts>(API_ENDPOINTS.getProducts);
  }

  postProducts(productData: Product): Observable<Product> {
    return this.http.post<Product>(API_ENDPOINTS.postProduct, productData);
  }

  updateProduct(id: string, productData: Product): Observable<Product> {
    return this.http.put<Product>(`${API_ENDPOINTS.putProduct}/${id}`, productData);
  }
}
