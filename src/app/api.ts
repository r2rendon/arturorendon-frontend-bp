import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetProducts, Product } from '../types/api';
import { catchError, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  toastr = inject(ToastrService);

  constructor(private http: HttpClient) {}

  private baseErrorHandling = (err: unknown, error: string) => {
    this.toastr.error(error);
    throw err;
  };

  getProduct(id: string) {
    return this.http
      .get<Product>(`${API_ENDPOINTS.getProducts}/${id}`)
      .pipe(
        catchError((err) =>
          this.baseErrorHandling(
            err,
            'Lo sentimos, no se pudo cargar el producto. Intenta de nuevo mas tarde.',
          ),
        ),
      );
  }

  getProducts() {
    return this.http
      .get<GetProducts>(API_ENDPOINTS.getProducts)
      .pipe(
        catchError((err) =>
          this.baseErrorHandling(
            err,
            'Lo sentimos, la lista de productos no pudo ser cargada. Intenta de nuevo mas tarde.',
          ),
        ),
      );
  }

  postProducts(productData: Product): Observable<Product> {
    return this.http
      .post<Product>(API_ENDPOINTS.postProduct, productData)
      .pipe(
        catchError((err) =>
          this.baseErrorHandling(
            err,
            'Lo sentimos, el producto no pudo ser agregado. Favor intentar nuevamente.',
          ),
        ),
      );
  }

  updateProduct(id: string, productData: Product): Observable<Product> {
    return this.http
      .put<Product>(`${API_ENDPOINTS.putProduct}/${id}`, productData)
      .pipe(
        catchError((err) =>
          this.baseErrorHandling(
            err,
            'Lo sentimos, el producto no pudo ser actualizado. Favor intentar nuevamente.',
          ),
        ),
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${API_ENDPOINTS.getProducts}/${id}`)
      .pipe(
        catchError((err) =>
          this.baseErrorHandling(
            err,
            'Lo sentimos, el producto no pudo ser eliminado. Favor intentar nuevamente.',
          ),
        ),
      );
  }
}
