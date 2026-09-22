import { Routes } from '@angular/router';
import { RoutesManagement } from '../../shared/constants/app-routes.constants';

export const AUTH_ROUTES: Routes = [
  {
    path: RoutesManagement.LOGIN.path,
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: RoutesManagement.LOGIN.path,
    pathMatch: 'full',
  },
];
