import { Routes } from '@angular/router';
import { RoutesManagement } from './shared/constants/app-routes.constants';

export const routes: Routes = [
  {
    path: RoutesManagement.AUTH.path,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    redirectTo: `${RoutesManagement.AUTH.path}/${RoutesManagement.LOGIN.path}`,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: `${RoutesManagement.AUTH.path}/${RoutesManagement.LOGIN.path}`,
  },
];
