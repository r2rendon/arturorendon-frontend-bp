import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { ProductRegisterPage } from './product-register-page';
import { ApiService } from '../api';

describe('ProductRegisterPage', () => {
  let component: ProductRegisterPage;
  let fixture: ComponentFixture<ProductRegisterPage>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRegisterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegisterPage);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
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

  it('onSubmit prevents default and does not alert when form is invalid', () => {
    const preventDefaultSpy = vi.fn();
    component.onSubmit({ preventDefault: preventDefaultSpy } as unknown as Event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('onSubmit posts product when form is valid', () => {
    const postSpy = vi.spyOn(apiService, 'postProducts').mockReturnValue(
      of({
        id: '123',
        name: 'Maria Anders',
        description: 'Germany',
        logo: 'https://example.com/logo.png',
        date_release: '2023-02-22',
        date_revision: '2024-02-22',
      }),
    );

    component.form.setValue({
      id: '123',
      nombre: 'Maria Anders',
      descripcion: 'Germany',
      logo: 'https://example.com/logo.png',
      fechaLiberacion: '2023-02-22',
      fechaRevision: '2024-02-22',
    });

    const preventDefaultSpy = vi.fn();
    component.onSubmit({ preventDefault: preventDefaultSpy } as unknown as Event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(postSpy).toHaveBeenCalledWith({
      id: '123',
      name: 'Maria Anders',
      description: 'Germany',
      logo: 'https://example.com/logo.png',
      date_release: '2023-02-22',
      date_revision: '2024-02-22',
    });
  });

  it('onReset resets submitted flag and restores default dates', () => {
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
    expect(component.form.controls.fechaLiberacion.value).toBe('2023-02-22');
    expect(component.form.controls.fechaRevision.value).toBe('2024-02-22');
  });
});
