import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api';
import { ProductRegisterFormControls } from '../../types/form';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/api';
import { mapProductRegisterFormToProduct } from '../../helpers/api';

@Component({
  selector: 'app-product-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-register-page.html',
  styleUrl: './product-register-page.css',
  standalone: true,
})
export class ProductRegisterPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitted = false;
  toastr = inject(ToastrService);
  isEditMode = false;
  private editingProductId: string | null = null;

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

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.isEditMode = !!id;
      this.editingProductId = id;

      if (id) {
        this.prefillForEdit(id);
      } else {
        this.form.controls.id.enable();
      }
    });
  }

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
    if (this.isEditMode && this.editingProductId) {
      this.apiService.updateProduct(this.editingProductId, productData).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('¡Producto actualizado exitosamente!');
          this.router.navigate(['products', this.editingProductId]);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(
            'Lo sentimos, el producto no pudo ser actualizado. Favor intentar nuevamente.',
          );
        },
      });
      return;
    }

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

  private prefillForEdit(id: string) {
    this.apiService.getProduct(id).subscribe({
      next: (response) => {
        console.log(response);
        if (!response) {
          this.toastr.error('Producto no encontrado.');
          this.router.navigate(['products']);
          return;
        }

        this.patchFormFromProduct(response);
        this.form.controls.id.disable();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Lo sentimos, no se pudo cargar el producto para editar.');
      },
    });
  }

  private patchFormFromProduct(product: Product) {
    this.form.patchValue({
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      logo: product.logo,
      fechaLiberacion: product.date_release,
      fechaRevision: product.date_revision,
    });
  }
}
