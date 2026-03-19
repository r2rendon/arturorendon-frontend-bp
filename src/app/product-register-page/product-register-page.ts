import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api';
import { ProductRegisterFormControls } from '../../types/form';
import { mapProductRegisterFormToProduct } from '../helpers/api';

@Component({
  selector: 'app-product-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-register-page.html',
  styleUrl: './product-register-page.css',
})
export class ProductRegisterPage {
  submitted = false;

  form = new FormGroup<ProductRegisterFormControls>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9]+$/)],
    }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    logo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaLiberacion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaRevision: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private apiService: ApiService) {}

  isInvalid(controlName: keyof ProductRegisterFormControls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const productData = mapProductRegisterFormToProduct(this.form.getRawValue());
    this.apiService.postProducts(productData).subscribe();
  }

  onReset(): void {
    this.submitted = false;

    this.form.reset({
      id: '',
      nombre: '',
      descripcion: '',
      logo: '',
      fechaLiberacion: '2023-02-22',
      fechaRevision: '2024-02-22',
    });
  }
}
