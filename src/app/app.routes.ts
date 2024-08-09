import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './pages/home/login-layout/login-layout.component';
import { HomeComponent } from './pages/home/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES) },
    ]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'sales', loadChildren: () => import('./pages/sales/sales.routes').then(m => m.SALES_ROUTES) },
      { path: 'marketing', loadChildren: () => import('./pages/marketing/marketing.routes').then(m => m.MARKETING_ROUTES) },
      { path: 'reports', loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES) },
      { path: 'settings', loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
      { path: 'users', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES) },
      { path: 'information', loadChildren: () => import('./pages/information/information.routes').then(m => m.INFORMATION_ROUTES) },
    ]
  }
];