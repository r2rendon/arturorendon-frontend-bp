import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ApiService } from './api';
import { API_ENDPOINTS } from '../constants/api';

describe('ApiService', () => {
  let service: ApiService;
  let httpClientMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let toastrMock: {
    error: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    toastrMock = {
      error: vi.fn(),
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
        {
          provide: ToastrService,
          useValue: toastrMock,
        },
      ],
    });

    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProduct requests a product by id', async () => {
    const response = {
      id: '1',
      name: 'Cuenta Plus',
      description: 'Producto premium',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    };
    httpClientMock.get.mockReturnValue(of(response));

    await expect(firstValueFrom(service.getProduct('1'))).resolves.toEqual(response);
    expect(httpClientMock.get).toHaveBeenCalledWith(`${API_ENDPOINTS.getProducts}/1`);
  });

  it('getProduct shows an error toast when the request fails', async () => {
    const error = new Error('network');
    httpClientMock.get.mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.getProduct('1'))).rejects.toBe(error);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Lo sentimos, no se pudo cargar el producto. Intenta de nuevo mas tarde.',
    );
  });

  it('getProducts requests the product list', async () => {
    const response = {
      data: [
        {
          id: '1',
          name: 'Cuenta Plus',
          description: 'Producto premium',
          logo: 'https://example.com/logo.png',
          date_release: '2099-01-01',
          date_revision: '2100-01-01',
        },
      ],
    };
    httpClientMock.get.mockReturnValue(of(response));

    await expect(firstValueFrom(service.getProducts())).resolves.toEqual(response);
    expect(httpClientMock.get).toHaveBeenCalledWith(API_ENDPOINTS.getProducts);
  });

  it('getProducts shows an error toast when the request fails', async () => {
    const error = new Error('network');
    httpClientMock.get.mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.getProducts())).rejects.toBe(error);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Lo sentimos, la lista de productos no pudo ser cargada. Intenta de nuevo mas tarde.',
    );
  });

  it('postProducts sends the payload to the API', async () => {
    const product = {
      id: '1',
      name: 'Cuenta Plus',
      description: 'Producto premium',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    };
    httpClientMock.post.mockReturnValue(of(product));

    await expect(firstValueFrom(service.postProducts(product))).resolves.toEqual(product);
    expect(httpClientMock.post).toHaveBeenCalledWith(API_ENDPOINTS.postProduct, product);
  });

  it('postProducts shows an error toast when the request fails', async () => {
    const error = new Error('network');
    httpClientMock.post.mockReturnValue(throwError(() => error));

    await expect(
      firstValueFrom(
        service.postProducts({
          id: '1',
          name: 'Cuenta Plus',
          description: 'Producto premium',
          logo: 'https://example.com/logo.png',
          date_release: '2099-01-01',
          date_revision: '2100-01-01',
        }),
      ),
    ).rejects.toBe(error);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Lo sentimos, el producto no pudo ser agregado. Favor intentar nuevamente.',
    );
  });

  it('updateProduct sends the update payload to the API', async () => {
    const product = {
      id: '1',
      name: 'Cuenta Plus',
      description: 'Producto premium',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    };
    httpClientMock.put.mockReturnValue(of(product));

    await expect(firstValueFrom(service.updateProduct('1', product))).resolves.toEqual(product);
    expect(httpClientMock.put).toHaveBeenCalledWith(`${API_ENDPOINTS.putProduct}/1`, product);
  });

  it('updateProduct shows an error toast when the request fails', async () => {
    const error = new Error('network');
    httpClientMock.put.mockReturnValue(throwError(() => error));

    await expect(
      firstValueFrom(
        service.updateProduct('1', {
          id: '1',
          name: 'Cuenta Plus',
          description: 'Producto premium',
          logo: 'https://example.com/logo.png',
          date_release: '2099-01-01',
          date_revision: '2100-01-01',
        }),
      ),
    ).rejects.toBe(error);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Lo sentimos, el producto no pudo ser actualizado. Favor intentar nuevamente.',
    );
  });

  it('deleteProduct calls the delete endpoint', async () => {
    httpClientMock.delete.mockReturnValue(of(void 0));

    await expect(firstValueFrom(service.deleteProduct('1'))).resolves.toBeUndefined();
    expect(httpClientMock.delete).toHaveBeenCalledWith(`${API_ENDPOINTS.getProducts}/1`);
  });

  it('deleteProduct shows an error toast when the request fails', async () => {
    const error = new Error('network');
    httpClientMock.delete.mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.deleteProduct('1'))).rejects.toBe(error);
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Lo sentimos, el producto no pudo ser eliminado. Favor intentar nuevamente.',
    );
  });

  it('verifyProductId returns the API response when successful', async () => {
    httpClientMock.get.mockReturnValue(of(true));

    await expect(firstValueFrom(service.verifyProductId('123'))).resolves.toBe(true);
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.getProducts}/verification/123`,
    );
  });

  it('verifyProductId falls back to false when the request fails', async () => {
    httpClientMock.get.mockReturnValue(throwError(() => new Error('network')));

    await expect(firstValueFrom(service.verifyProductId('123'))).resolves.toBe(false);
  });
});
