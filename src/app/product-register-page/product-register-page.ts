import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api';
import { ProductRegisterFormControls } from '../../types/form';
import { mapProductRegisterFormToProduct } from '../helpers/api';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-register-page.html',
  styleUrl: './product-register-page.css',
  standalone: true,
})
export class ProductRegisterPage {
  private router = inject(Router);

  submitted = false;
  toastr = inject(ToastrService);

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
    this.apiService.postProducts(productData).subscribe({
      next: (response) => {
        console.log(response);
        this.toastr.success('¡Producto agregado exitosamente!');
        this.router.navigate(['products']);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(
          'Lo sentimos, el producto no pudo ser agregado. Favor intentar nuevamente.',
        );
      },
    });
  }

  onReset(): void {
    this.submitted = false;

    this.form.reset({
      id: '',
      nombre: '',
      descripcion: '',
      logo: '',
      fechaLiberacion: '',
      fechaRevision: '',
    });
  }
}

bootstrapApplication(ProductRegisterPage, {
  providers: [provideToastr()],
});
