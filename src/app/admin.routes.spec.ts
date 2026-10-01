import { TestBed } from '@angular/core/testing';
import { adminRoleGuard, ADMIN_ROUTES } from './admin.routes';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page';
import { AdminProductsPageComponent } from './pages/admin-products-page/admin-products-page';
import { AdminProductFormPageComponent } from './pages/admin-product-form-page/admin-product-form-page';

describe('Admin Routes', () => {
  describe('ADMIN_ROUTES Configuration', () => {
    it('should define all four admin routes', () => {
      expect(ADMIN_ROUTES.length).toBe(4);
    });

    it('should map empty path to AdminDashboardPageComponent with role guard', () => {
      const dashboardRoute = ADMIN_ROUTES.find((r) => r.path === '');
      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.component).toBe(AdminDashboardPageComponent);
      expect(dashboardRoute?.canActivate).toBeDefined();
      expect(dashboardRoute?.canActivate).toContain(adminRoleGuard);
    });

    it('should map products path to AdminProductsPageComponent with role guard', () => {
      const productsRoute = ADMIN_ROUTES.find((r) => r.path === 'products');
      expect(productsRoute).toBeDefined();
      expect(productsRoute?.component).toBe(AdminProductsPageComponent);
      expect(productsRoute?.canActivate).toBeDefined();
      expect(productsRoute?.canActivate).toContain(adminRoleGuard);
    });

    it('should map products/new path to AdminProductFormPageComponent with role guard', () => {
      const createRoute = ADMIN_ROUTES.find((r) => r.path === 'products/new');
      expect(createRoute).toBeDefined();
      expect(createRoute?.component).toBe(AdminProductFormPageComponent);
      expect(createRoute?.canActivate).toBeDefined();
      expect(createRoute?.canActivate).toContain(adminRoleGuard);
    });

    it('should map products/:id/edit path to AdminProductFormPageComponent with role guard', () => {
      const editRoute = ADMIN_ROUTES.find((r) => r.path === 'products/:id/edit');
      expect(editRoute).toBeDefined();
      expect(editRoute?.component).toBe(AdminProductFormPageComponent);
      expect(editRoute?.canActivate).toBeDefined();
      expect(editRoute?.canActivate).toContain(adminRoleGuard);
    });

    it('should have adminRoleGuard function exported', () => {
      expect(typeof adminRoleGuard).toBe('function');
    });

    it('should protect all routes with the same role guard function', () => {
      const guardedRoutes = ADMIN_ROUTES.filter((r) => r.canActivate);
      guardedRoutes.forEach((route) => {
        expect(route.canActivate).toContain(adminRoleGuard);
      });
    });
  });
});
