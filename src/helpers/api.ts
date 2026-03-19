import { Product } from '../types/api';
import { ProductRegisterFormValue } from '../types/form';

export function mapProductRegisterFormToProduct(value: ProductRegisterFormValue): Product {
  return {
    id: value.id,
    name: value.nombre,
    description: value.descripcion,
    logo: value.logo,
    date_release: value.fechaLiberacion,
    date_revision: value.fechaRevision,
  };
}
