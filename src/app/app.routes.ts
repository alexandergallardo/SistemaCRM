import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'marketing',
    loadChildren: () => import('./pages/marketing/marketing.routes').then(m => m.MARKETING_ROUTES)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES)
  },
  {
    path: 'sales',
    loadChildren: () => import('./pages/sales/sales.routes').then(m => m.SALES_ROUTES)
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.routes').then(m => m.INFORMATION_ROUTES)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
  }
];
