import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page';
import { AdminProductsPageComponent } from './pages/admin-products-page/admin-products-page';
import { AdminProductFormPageComponent } from './pages/admin-product-form-page/admin-product-form-page';

/**
 * Guard to protect admin routes by verifying ADMIN role from global store
 * The global store is shared from the Shell App via Module Federation singleton
 */
export const adminRoleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  // Select isAdmin from the global auth state
  // The selector should match the Shell App's auth state structure
  return store.select((appState: any) => {
    // Access the auth state from the global store
    // In Module Federation setup, the Store is a singleton shared with Shell App
    const authState = appState.auth;
    return authState?.user?.role === 'ADMIN';
  }).pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true;
      }
      // Redirect to products if user is not admin
      router.navigate(['/products']);
      return false;
    }),
  );
};

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
    canActivate: [adminRoleGuard],
  },
  {
    path: 'products',
    component: AdminProductsPageComponent,
    canActivate: [adminRoleGuard],
  },
  {
    path: 'products/new',
    component: AdminProductFormPageComponent,
    canActivate: [adminRoleGuard],
  },
  {
    path: 'products/:id/edit',
    component: AdminProductFormPageComponent,
    canActivate: [adminRoleGuard],
  },
];
