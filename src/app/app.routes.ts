import { Routes } from '@angular/router';
import { RoutesManagement } from './shared/constants/app-routes.constants';
import { authGuard } from '@core/guards/auth-guard';
import { guestGuard } from '@core/guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: RoutesManagement.AUTH.path, pathMatch: 'full' },

  {
    path: RoutesManagement.AUTH.path,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  // main route
  {
    path: RoutesManagement.MAIN.path,
    canActivate: [authGuard],
    loadComponent: () => import('@shared/components/main/main').then((m) => m.Main),
    children: [
      {
        path: '',
        redirectTo: RoutesManagement.DASHBOARD.path,
        pathMatch: 'full',
      },
      {
        path: RoutesManagement.DASHBOARD.path,
        loadComponent: () =>
          import('@shared/components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: RoutesManagement.CLINICS.path,
        loadComponent: () =>
          import('./features/clinics/pages/clinics-management/clinics-management').then(
            (m) => m.ClinicsManagementPage
          ),
      },
      {
        path: RoutesManagement.DOCTORS.path,
        loadComponent: () =>
          import('./features/doctors/pages/doctors-management/doctors-management').then(
            (m) => m.DoctorsManagementPage
          ),
      },
      {
        path: RoutesManagement.EMPLOYEES.path,
        loadComponent: () =>
          import('./features/employees/pages/employees-management/employees-management').then(
            (m) => m.EmployeesManagementPage
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('@shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
