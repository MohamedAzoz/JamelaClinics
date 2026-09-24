import { Routes } from '@angular/router';
import { RoutesManagement } from './shared/constants/app-routes.constants';
import { authGuard } from '@core/guards/auth-guard';
import { roleGuard } from '@core/guards/role-guard';
import { ROLES } from '@shared/constants/roles.constants';

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
            (m) => m.ClinicsManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTORS.path,
        loadComponent: () =>
          import('./features/doctors/pages/doctors-management/doctors-management').then(
            (m) => m.DoctorsManagementPage,
          ),
      },
      {
        path: RoutesManagement.EMPLOYEES.path,
        loadComponent: () =>
          import('./features/employees/pages/employees-management/employees-management').then(
            (m) => m.EmployeesManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_SCHEDULES.path,
        loadComponent: () =>
          import('./features/doctorSchedules/pages/doctor-schedule-management/doctor-schedule-management').then(
            (m) => m.DoctorScheduleManagementPage,
          ),
      },
      {
        path: RoutesManagement.TODAY_DOCTOR_SCHEDULES.path,
        loadComponent: () =>
          import('./features/doctorSchedules/pages/today-schedules/today-schedules').then(
            (m) => m.TodaySchedulesPage,
          ),
      },
      {
        path: RoutesManagement.USER_LOGIN_LOGS.path,
        loadComponent: () =>
          import('./features/auth/pages/user-login-log/user-login-log').then(
            (m) => m.UserLoginLogPage,
          ),
      },
      {
        path: RoutesManagement.CHANGE_PASSWORD.path,
        loadComponent: () =>
          import('./features/auth/pages/change-password/change-password').then(
            (m) => m.ChangePasswordPage,
          ),
      },
      {
        path: RoutesManagement.PROFILE.path,
        loadComponent: () => import('./features/auth/pages/profile/profile').then((m) => m.UserProfilePage),
      },

      {
        path: RoutesManagement.APPOINTMENTS.path,
        canActivate: [roleGuard],
        data: {
          roles: [ROLES.Admin],
        },
        loadComponent: () =>
          import('./features/appointments/pages/appointments-management/appointments-management').then(
            (m) => m.AppointmentsManagementPage,
          ),
      },
      {
        path: RoutesManagement.APPOINTMENT_BOOKING.path,
        loadComponent: () =>
          import('./features/appointments/pages/appointment-booking/appointment-booking').then(
            (m) => m.AppointmentBookingPage,
          ),
      },
      {
        path: RoutesManagement.SCHEDULE_APPOINTMENTS.path,
        loadComponent: () =>
          import('./features/appointments/pages/schedule-appointments/schedule-appointments').then(
            (m) => m.ScheduleAppointmentsPage,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('@shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
