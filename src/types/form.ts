import { FormControl } from '@angular/forms';
import { Product } from './api';

export interface ProductRegisterFormValue {
  id: string;
  nombre: string;
  descripcion: string;
  logo: string;
  fechaLiberacion: string;
  fechaRevision: string;
}

export type ProductRegisterFormControls = {
  [K in keyof ProductRegisterFormValue]: FormControl<ProductRegisterFormValue[K]>;
};
