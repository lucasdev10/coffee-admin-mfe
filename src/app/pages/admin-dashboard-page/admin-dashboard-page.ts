import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CurrencyPipe, AsyncPipe],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminDashboardPageComponent {
  private readonly store = inject(Store);

  // Placeholder observables with correct types
  readonly totalProducts$ = of(0);
  readonly totalValue$ = of(0);
  readonly lowStockProducts$ = of(0);
  readonly totalOrders$ = of(0);

  constructor() {
    // Load initial data if needed
  }
}
