import { NavItem } from '@shared/models/nav-item';

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'doctors', label: 'الأطباء', route: '/main/doctors' },
  { icon: 'users', label: 'الموظفين', route: '/main/employees' },
  { icon: 'clinics', label: 'العيادات', route: '/main/clinics' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const DOCTOR_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'appointments', label: 'حجوزاتي', route: '/main/appointments' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const RECEPTIONIST_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'payment', label: 'المدفوعات', route: '/main/payments' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const ACCOUNTANT_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'payment', label: 'المدفوعات', route: '/main/payments' },
  { icon: 'reports', label: 'التقارير', route: '/main/reports' },
  { icon: 'inventory', label: 'المخزن', route: '/main/inventory' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];
