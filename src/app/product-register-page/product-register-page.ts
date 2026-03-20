import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { ApiService } from '../api';
import { ProductRegisterFormControls } from '../../types/form';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/api';
import { mapProductRegisterFormToProduct } from '../../helpers/api';
import { firstValueFrom, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeleteConfirmationModal } from '../delete-confirmation-modal/delete-confirmation-modal';
import { ProductRegisterFormSkeletonComponent } from './product-register-form-skeleton.component';

@Component({
  selector: 'app-product-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeleteConfirmationModal,
    ProductRegisterFormSkeletonComponent,
  ],
  templateUrl: './product-register-page.html',
  styleUrl: './product-register-page.css',
  standalone: true,
})
export class ProductRegisterPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  submitted = false;
  toastr = inject(ToastrService);
  isEditMode = false;
  private editingProductId: string | null = null;

  // Loading state for form
  isLoadingForm = signal(false);

  // Delete confirmation modal state
  isDeleteModalOpen = signal(false);
  productToDelete = signal<string>('');

  // Custom validators
  private minDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { minDate: true };
  }

  private createExactYearValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const fechaRevision = new Date(control.value);
      const fechaLiberacion = this.form?.get('fechaLiberacion')?.value;

      if (!fechaLiberacion) return null;

      const liberacionDate = new Date(fechaLiberacion);
      const expectedRevisionDate = new Date(liberacionDate);
      expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);

      // Compare dates (ignore time)
      const revisionTime = new Date(
        fechaRevision.getFullYear(),
        fechaRevision.getMonth(),
        fechaRevision.getDate(),
      ).getTime();
      const expectedTime = new Date(
        expectedRevisionDate.getFullYear(),
        expectedRevisionDate.getMonth(),
        expectedRevisionDate.getDate(),
      ).getTime();

      return revisionTime === expectedTime ? null : { exactYear: true };
    };
  }

  private createIdExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      // Skip validation if ID is disabled (edit mode)
      if (control.disabled) return of(null);

      return this.apiService
        .verifyProductId(control.value)
        .pipe(map((exists) => (exists ? { idExists: true } : null)));
    };
  }

  form = new FormGroup<ProductRegisterFormControls>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/),
      ],
      asyncValidators: [this.createIdExistsValidator()],
      updateOn: 'blur',
    }),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
    }),
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
    }),
    logo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaLiberacion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.minDateValidator.bind(this)],
    }),
    fechaRevision: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.createExactYearValidator()],
    }),
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
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

  getErrorMessage(controlName: keyof ProductRegisterFormControls): string {
    const control = this.form.controls[controlName];
    if (!control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (control.errors['pattern']) return 'Solo se permiten números';
    if (control.errors['idExists'])
      return 'Este ID ya existe en el sistema, favor elige uno diferente';
    if (control.errors['minDate']) return 'La fecha debe ser igual o mayor a la fecha actual';
    if (control.errors['exactYear'])
      return 'La fecha debe ser exactamente un año posterior a la fecha de liberación';

    return 'Campo inválido';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const productData = mapProductRegisterFormToProduct(this.form.getRawValue());
    if (this.isEditMode && this.editingProductId) {
      await firstValueFrom(this.apiService.updateProduct(this.editingProductId, productData));

      this.toastr.success('¡Producto actualizado exitosamente!');
      this.router.navigate(['products', this.editingProductId]);
      return;
    }

    const response = await firstValueFrom(this.apiService.postProducts(productData));

    console.log(response);
    this.toastr.success('¡Producto agregado exitosamente!');
    this.router.navigate(['products']);
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

  goBack(): void {
    this.router.navigate(['/products']);
  }

  private async prefillForEdit(id: string) {
    try {
      this.isLoadingForm.set(true);
      const response = await firstValueFrom(this.apiService.getProduct(id));

      if (!response) {
        this.toastr.error('Producto no encontrado.');
        this.router.navigate(['products']);
        return;
      }

      this.patchFormFromProduct(response);
      this.form.controls.id.disable();
    } catch (error) {
      console.error('Error loading product:', error);
      this.toastr.error('Error al cargar el producto.');
      this.router.navigate(['products']);
    } finally {
      this.isLoadingForm.set(false);
    }
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

  openDeleteModal() {
    this.productToDelete.set(this.form.controls.nombre.value);
    this.isDeleteModalOpen.set(true);
  }

  async handleDeleteConfirm() {
    if (!this.editingProductId) return;

    try {
      await firstValueFrom(this.apiService.deleteProduct(this.editingProductId));
      this.toastr.success('Producto eliminado exitosamente');
      this.isDeleteModalOpen.set(false);
      this.router.navigate(['products']);
    } catch (error) {
      this.toastr.error('Error al eliminar el producto');
      console.error(error);
      this.isDeleteModalOpen.set(false);
    }
  }

  handleDeleteCancel() {
    this.isDeleteModalOpen.set(false);
  }
}
