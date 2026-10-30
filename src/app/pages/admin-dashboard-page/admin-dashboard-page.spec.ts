import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { AdminDashboardPageComponent } from './admin-dashboard-page';

describe('AdminDashboardPageComponent', () => {
  let component: AdminDashboardPageComponent;
  let fixture: ComponentFixture<AdminDashboardPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            auth: {
              user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' },
              isAuthenticated: true,
              token: 'test-token',
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have totalProducts observable', async () => {
    const value = await firstValueFrom(component.totalProducts$);
    expect(value).toBe(0);
  });

  it('should have totalValue observable', async () => {
    const value = await firstValueFrom(component.totalValue$);
    expect(value).toBe(0);
  });

  it('should have lowStockProducts observable', async () => {
    const value = await firstValueFrom(component.lowStockProducts$);
    expect(value).toBe(0);
  });

  it('should have totalOrders observable', async () => {
    const value = await firstValueFrom(component.totalOrders$);
    expect(value).toBe(0);
  });

  it('should inject Store from Shell App', () => {
    expect(component['store']).toBeDefined();
    expect(component['store']).toBe(store);
  });

  it('should be a standalone component', () => {
    const metadata = (AdminDashboardPageComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
  });

  it('should have mat-card, mat-button, and mat-icon imports', () => {
    const metadata = (AdminDashboardPageComponent as any).ɵcmp;
    expect(metadata.dependencies).toBeDefined();
  });
});
