import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../types/api';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from './constants/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postProducts(productData: Product): Observable<Product> {
    return this.http.post<Product>(API_ENDPOINTS.postProduct, productData);
  }
}
