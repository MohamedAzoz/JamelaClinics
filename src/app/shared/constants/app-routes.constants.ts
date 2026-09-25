export const RoutesManagement = {
  AUTH: { path: 'auth' },
  LOGIN: { path: 'login' },
  MAIN: { path: 'main' },
  DASHBOARD: { path: 'dashboard' },
  CLINICS: { path: 'clinics' },
  DOCTORS: { path: 'doctors' },
  EMPLOYEES: { path: 'employees' },
  TREASURY: { path: 'treasury' },
  DOCTOR_SCHEDULES: { path: 'doctor-schedules' },
  TODAY_DOCTOR_SCHEDULES: { path: 'today-doctor-schedules' },
  USER_LOGIN_LOGS: { path: 'user-login-logs' },
  PROFILE: { path: 'profile' },
  CHANGE_PASSWORD: { path: 'change-password' },
  ADMIN_PASSWORD_MANAGEMENT: { path: 'admin-password-management' },
  APPOINTMENTS: { path: 'appointments' },
  APPOINTMENT_BOOKING: { path: 'appointment-booking' },
  SCHEDULE_APPOINTMENTS: { path: 'schedule-appointments/:scheduleId' },
} as const;

export const HospitalName = 'جميلة' as const;
