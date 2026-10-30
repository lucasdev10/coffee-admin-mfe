import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
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

  describe('adminRoleGuard - Role-Based Access Logic', () => {
    let store: MockStore;
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideMockStore({
            initialState: {
              auth: {
                user: null,
                isAuthenticated: false,
                token: null,
                loading: false,
                error: null,
              },
            },
          }),
        ],
      });

      store = TestBed.inject(MockStore);
      router = TestBed.inject(Router);
    });

    it('should allow access when user has ADMIN role', async () => {
      // Mock auth state with ADMIN user
      store.setState({
        auth: {
          user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' },
          isAuthenticated: true,
          token: 'test-token',
          loading: false,
          error: null,
        },
      });

      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(true);
    });

    it('should deny access when user has USER role', async () => {
      // Mock auth state with regular USER
      store.setState({
        auth: {
          user: { id: '2', name: 'Regular User', email: 'user@test.com', role: 'USER' },
          isAuthenticated: true,
          token: 'test-token',
          loading: false,
          error: null,
        },
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should deny access when user is not authenticated', async () => {
      // Mock auth state with no user
      store.setState({
        auth: {
          user: null,
          isAuthenticated: false,
          token: null,
          loading: false,
          error: null,
        },
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should deny access when auth state is missing', async () => {
      // Mock state without auth
      store.setState({} as any);

      const navigateSpy = vi.spyOn(router, 'navigate');
      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should deny access when user object exists but role is not ADMIN', async () => {
      // Mock auth state with user but no role
      store.setState({
        auth: {
          user: { id: '3', name: 'No Role User', email: 'norole@test.com', role: undefined },
          isAuthenticated: true,
          token: 'test-token',
          loading: false,
          error: null,
        },
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });

    it('should work with global store shared from Shell App', async () => {
      // This test verifies the guard works with Module Federation singleton store
      store.setState({
        auth: {
          user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
          isAuthenticated: true,
          token: 'shell-token',
          loading: false,
          error: null,
        },
      });

      const mockRoute: any = {};
      const mockState: any = {};

      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(result).toBe(true);
    });

    it('should redirect to /products on access denial', async () => {
      store.setState({
        auth: {
          user: { id: '2', name: 'User', email: 'user@test.com', role: 'USER' },
          isAuthenticated: true,
          token: 'test-token',
          loading: false,
          error: null,
        },
      });

      const navigateSpy = vi.spyOn(router, 'navigate');
      const mockRoute: any = {};
      const mockState: any = {};

      await firstValueFrom(
        TestBed.runInInjectionContext(() => adminRoleGuard(mockRoute, mockState)) as any,
      );

      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
