import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDay,
  faClipboardList,
  faMapMarkerAlt,
  faPhone,
  faUser,
  faUserMd,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { VisitType } from '../../models/VisitType';
import { AppointmentStatus } from '../../models/AppointmentStatus';

@Component({
  selector: 'app-appointment-patient-info',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './appointment-patient-info.html',
})
export class AppointmentPatientInfoComponent {
  readonly appointment = input.required<AppointmentsMaterial>();

  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faClipboardList = faClipboardList;

  readonly statusBadgeClass = computed(() => {
    const status = Number(this.appointment()?.status ?? 1);
    switch (status) {
      case AppointmentStatus.Unpaid:
        return 'bg-warning/10 text-warning border border-warning/20';
      case AppointmentStatus.InProgress:
        return 'bg-accent/10 text-accent border border-accent/20';
      case AppointmentStatus.Completed:
        return 'bg-success/10 text-success border border-success/20';
      case AppointmentStatus.Cancelleted:
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-warning/10 text-warning border border-warning/20';
    }
  });

  getVisitTypeName(type: VisitType | number | string | null | undefined): string {
    switch (Number(type)) {
      case VisitType.NewConsultation:
        return 'كشف جديد';
      case VisitType.FollowUp:
        return 'إعادة';
      case VisitType.Sessions:
        return 'جلسات';
      case VisitType.Laser:
        return 'ليزر';
      case VisitType.Fractional:
        return 'فراكشنال';
      default:
        return 'كشف';
    }
  }

  getStatusName(status: AppointmentStatus | number | string | null | undefined): string {
    switch (Number(status)) {
      case AppointmentStatus.Unpaid:
        return 'غير مدفوع';
      case AppointmentStatus.InProgress:
        return 'قيد المعاينة';
      case AppointmentStatus.Completed:
        return 'مكتمل';
      case AppointmentStatus.Cancelleted:
        return 'ملغى';
      default:
        return 'غير مدفوع';
    }
  }
}
