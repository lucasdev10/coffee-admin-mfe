import { Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page';
import { AdminProductsPageComponent } from './pages/admin-products-page/admin-products-page';
import { AdminProductFormPageComponent } from './pages/admin-product-form-page/admin-product-form-page';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
  },
  {
    path: 'products',
    component: AdminProductsPageComponent,
  },
  {
    path: 'products/new',
    component: AdminProductFormPageComponent,
  },
  {
    path: 'products/:id/edit',
    component: AdminProductFormPageComponent,
  },
];
