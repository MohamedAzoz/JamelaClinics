import { NavItem } from '@shared/models/nav-item';

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'patients', label: 'المرضى', route: '/main/patients' },
  { icon: 'doctors', label: 'الأطباء', route: '/main/doctors' },
  { icon: 'assistant', label: 'المساعدون', route: '/main/assistants' },
  { icon: 'clinics', label: 'العيادات', route: '/main/clinics' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'queue', label: 'قائمة الانتظار', route: '/main/queue' },
  { icon: 'visits', label: 'الزيارات', route: '/main/visits' },
  { icon: 'lab', label: 'المختبر', route: '/main/lab' },
  { icon: 'radiology', label: 'الأشعة', route: '/main/radiology' },
  { icon: 'pharmacy', label: 'الصيدلية', route: '/main/pharmacy' },
  { icon: 'inventory', label: 'المخزن', route: '/main/inventory' },
  { icon: 'payment', label: 'المدفوعات', route: '/main/payments' },
  { icon: 'reports', label: 'التقارير', route: '/main/reports' },
  { icon: 'users', label: 'المستخدمون', route: '/main/users' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/settings' },
];

export const DOCTOR_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'appointments', label: 'حجوزاتي', route: '/main/appointments' },
  { icon: 'queue', label: 'قائمة الانتظار', route: '/main/queue' },
  { icon: 'visits', label: 'الزيارات', route: '/main/visits' },
  { icon: 'patients', label: 'مرضاي', route: '/main/patients' },
  { icon: 'lab', label: 'المختبر', route: '/main/lab' },
  { icon: 'radiology', label: 'الأشعة', route: '/main/radiology' },
  { icon: 'schedule', label: 'الجدول', route: '/main/schedule' },
];

export const RECEPTIONIST_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'queue', label: 'قائمة الانتظار', route: '/main/queue' },
  { icon: 'patients', label: 'المرضى', route: '/main/patients' },
  { icon: 'visits', label: 'الزيارات', route: '/main/visits' },
  { icon: 'payment', label: 'المدفوعات', route: '/main/payments' },
];

export const ACCOUNTANT_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'payment', label: 'المدفوعات', route: '/main/payments' },
  { icon: 'reports', label: 'التقارير', route: '/main/reports' },
  { icon: 'inventory', label: 'المخزن', route: '/main/inventory' },
];
