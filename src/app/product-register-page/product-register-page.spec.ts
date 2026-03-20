import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ProductRegisterPage } from './product-register-page';
import { ApiService } from '../api';

describe('ProductRegisterPage', () => {
  let component: ProductRegisterPage;
  let fixture: ComponentFixture<ProductRegisterPage>;
  let apiService: ApiService;
  let router: Router;
  const validReleaseDate = '2099-02-22';
  const validRevisionDate = '2100-02-22';

  const apiServiceMock = {
    verifyProductId: vi.fn(() => of(false)),
    postProducts: vi.fn(),
    updateProduct: vi.fn(),
    getProduct: vi.fn(),
    deleteProduct: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProductRegisterPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
        {
          provide: ToastrService,
          useValue: {
            success: () => undefined,
            error: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegisterPage);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isInvalid returns false when untouched and not submitted', () => {
    expect(component.form.controls.id.invalid).toBe(true);
    expect(component.isInvalid('id')).toBe(false);
  });

  it('isInvalid returns true when a control is touched', () => {
    const control = component.form.controls.id;
    control.markAsTouched();
    expect(component.isInvalid('id')).toBe(true);
  });

  it('onSubmit prevents default and does not submit when form is invalid', async () => {
    const preventDefaultSpy = vi.fn();
    const postSpy = vi.spyOn(apiService, 'postProducts');
    await component.onSubmit({ preventDefault: preventDefaultSpy } as unknown as Event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.submitted).toBe(true);
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('onSubmit posts product when form is valid', async () => {
    const postSpy = vi.spyOn(apiService, 'postProducts').mockReturnValue(
      of({
        id: '123',
        name: 'Maria Anders',
        description: 'Germany',
        logo: 'https://example.com/logo.png',
        date_release: validReleaseDate,
        date_revision: validRevisionDate,
      }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({
      id: '123',
      nombre: 'Maria Anders',
      descripcion: 'Germany test',
      logo: 'https://example.com/logo.png',
      fechaLiberacion: validReleaseDate,
      fechaRevision: validRevisionDate,
    });

    const preventDefaultSpy = vi.fn();
    await component.onSubmit({ preventDefault: preventDefaultSpy } as unknown as Event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(postSpy).toHaveBeenCalledWith({
      id: '123',
      name: 'Maria Anders',
      description: 'Germany test',
      logo: 'https://example.com/logo.png',
      date_release: validReleaseDate,
      date_revision: validRevisionDate,
    });
    expect(navigateSpy).toHaveBeenCalledWith(['products']);
  });

  it('onReset resets submitted flag and clears the form', () => {
    component.submitted = true;
    component.form.setValue({
      id: '999',
      nombre: 'X',
      descripcion: 'Y',
      logo: 'https://example.com/logo2.png',
      fechaLiberacion: '2000-01-01',
      fechaRevision: '2000-01-02',
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.form.controls.id.value).toBe('');
    expect(component.form.controls.nombre.value).toBe('');
    expect(component.form.controls.descripcion.value).toBe('');
    expect(component.form.controls.logo.value).toBe('');
    expect(component.form.controls.fechaLiberacion.value).toBe('');
    expect(component.form.controls.fechaRevision.value).toBe('');
  });

  it('onSubmit updates product when in edit mode', async () => {
    const updateSpy = vi.spyOn(apiService, 'updateProduct').mockReturnValue(
      of({
        id: '123',
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'https://example.com/updated-logo.png',
        date_release: validReleaseDate,
        date_revision: validRevisionDate,
      }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const toastrSuccessSpy = vi.spyOn(component.toastr, 'success');

    component.isEditMode = true;
    component['editingProductId'] = '123';

    component.form.setValue({
      id: '123',
      nombre: 'Updated Product',
      descripcion: 'Updated Description',
      logo: 'https://example.com/updated-logo.png',
      fechaLiberacion: validReleaseDate,
      fechaRevision: validRevisionDate,
    });

    const preventDefaultSpy = vi.fn();
    await component.onSubmit({ preventDefault: preventDefaultSpy } as unknown as Event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith('123', {
      id: '123',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'https://example.com/updated-logo.png',
      date_release: validReleaseDate,
      date_revision: validRevisionDate,
    });
    expect(toastrSuccessSpy).toHaveBeenCalledWith('¡Producto actualizado exitosamente!');
    expect(navigateSpy).toHaveBeenCalledWith(['products', '123']);
  });

  it('goBack navigates to products page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('openDeleteModal sets product name and opens modal', () => {
    component.form.controls.nombre.setValue('Test Product Name');

    component.openDeleteModal();

    expect(component.productToDelete()).toBe('Test Product Name');
    expect(component.isDeleteModalOpen()).toBe(true);
  });

  it('handleDeleteCancel closes delete modal', () => {
    component.isDeleteModalOpen.set(true);

    component.handleDeleteCancel();

    expect(component.isDeleteModalOpen()).toBe(false);
  });

  it('handleDeleteConfirm deletes product successfully', async () => {
    const deleteSpy = vi.spyOn(apiService, 'deleteProduct').mockReturnValue(of(void 0));
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const toastrSuccessSpy = vi.spyOn(component.toastr, 'success');

    component['editingProductId'] = '123';
    component.isDeleteModalOpen.set(true);

    await component.handleDeleteConfirm();

    expect(deleteSpy).toHaveBeenCalledWith('123');
    expect(toastrSuccessSpy).toHaveBeenCalledWith('Producto eliminado exitosamente');
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['products']);
  });

  it('handleDeleteConfirm shows error message when delete fails', async () => {
    const deleteError = new Error('Delete failed');
    const deleteSpy = vi
      .spyOn(apiService, 'deleteProduct')
      .mockReturnValue(new Promise<void>((_, reject) => reject(deleteError)) as any);
    const toastrErrorSpy = vi.spyOn(component.toastr, 'error');

    component['editingProductId'] = '123';
    component.isDeleteModalOpen.set(true);

    await component.handleDeleteConfirm();

    expect(deleteSpy).toHaveBeenCalledWith('123');
    expect(toastrErrorSpy).toHaveBeenCalledWith('Error al eliminar el producto');
    expect(component.isDeleteModalOpen()).toBe(false);
  });

  it('handleDeleteConfirm logs error to console on failure', async () => {
    const deleteError = new Error('Delete failed');
    vi.spyOn(apiService, 'deleteProduct').mockReturnValue(
      new Promise<void>((_, reject) => reject(deleteError)) as any,
    );
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    component['editingProductId'] = '123';
    component.isDeleteModalOpen.set(true);

    await component.handleDeleteConfirm();

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('handleDeleteConfirm returns early when editingProductId is null', async () => {
    const deleteSpy = vi.spyOn(apiService, 'deleteProduct');

    component['editingProductId'] = null;

    await component.handleDeleteConfirm();

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('prefillForEdit loads product data and disables id control', async () => {
    const mockProduct = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'https://example.com/logo.png',
      date_release: validReleaseDate,
      date_revision: validRevisionDate,
    };

    vi.spyOn(apiService, 'getProduct').mockReturnValue(of(mockProduct));

    await component['prefillForEdit']('123');

    expect(component.form.controls.id.value).toBe('123');
    expect(component.form.controls.nombre.value).toBe('Test Product');
    expect(component.form.controls.descripcion.value).toBe('Test Description');
    expect(component.form.controls.logo.value).toBe('https://example.com/logo.png');
    expect(component.form.controls.id.disabled).toBe(true);
  });

  it('prefillForEdit handles product not found error', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const toastrErrorSpy = vi.spyOn(component.toastr, 'error');

    vi.spyOn(apiService, 'getProduct').mockReturnValue(of(null as any));

    await component['prefillForEdit']('999');

    expect(toastrErrorSpy).toHaveBeenCalledWith('Producto no encontrado.');
    expect(navigateSpy).toHaveBeenCalledWith(['products']);
  });

  it('displays validation message for unknown errors', () => {
    const control = component.form.controls.id;
    control.setErrors({ unknownError: true });

    const message = component.getErrorMessage('id');

    expect(message).toBe('Campo inválido');
  });

  it('clears error message when control is valid', () => {
    const control = component.form.controls.id;
    control.setErrors(null);

    const message = component.getErrorMessage('id');

    expect(message).toBe('');
  });

  it('shows idExists error message', () => {
    const control = component.form.controls.id;
    control.setErrors({ idExists: true });

    const message = component.getErrorMessage('id');

    expect(message).toBe('Este ID ya existe en el sistema, favor elige uno diferente');
  });

  it('shows minDate error message', () => {
    const control = component.form.controls.fechaLiberacion;
    control.setErrors({ minDate: true });

    const message = component.getErrorMessage('fechaLiberacion');

    expect(message).toBe('La fecha debe ser igual o mayor a la fecha actual');
  });

  it('shows exactYear error message', () => {
    const control = component.form.controls.fechaRevision;
    control.setErrors({ exactYear: true });

    const message = component.getErrorMessage('fechaRevision');

    expect(message).toBe('La fecha debe ser exactamente un año posterior a la fecha de liberación');
  });

  it('isInvalid returns true when submitted and control is invalid', () => {
    component.submitted = true;
    const control = component.form.controls.id;
    control.setValue('');

    expect(component.isInvalid('id')).toBe(true);
  });
});
