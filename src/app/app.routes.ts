import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { ProductRegisterPage } from './product-register-page/product-register-page';

export const routes: Routes = [
  {
    path: 'products/register',
    component: ProductRegisterPage,
  },
  {
    path: 'products/:id/edit',
    component: ProductRegisterPage,
  },
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
