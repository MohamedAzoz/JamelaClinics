import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faUserMd,
  faCalendarDay,
  faCoins,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faClock,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { DatePipe } from '@angular/common';
import { VisitType } from '../../models/VisitType';
import { AppointmentStatus } from '../../models/AppointmentStatus';

@Component({
  selector: 'app-appointment-table',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './appointment-table.html',
})
export class AppointmentTableComponent {
  readonly facade = inject(AppointmentFacade);

  readonly Number = Number;

  // FontAwesome Icons
  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faCoins = faCoins;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faSpinner = faSpinner;
  readonly faClock = faClock;
  readonly faReceipt = faReceipt;

  getVisitTypeName(type: VisitType | number): string {
    switch (Number(type)) {
      case VisitType.NewConsultation: return 'كشف جديد';
      case VisitType.FollowUp: return 'استشارة / إعادة';
      case VisitType.Sessions: return 'جلسات';
      case VisitType.Laser: return 'ليزر';
      case VisitType.Fractional: return 'فراكشنال';
      default: return 'كشف';
    }
  }

  getStatusName(status: AppointmentStatus | number): string {
    switch (Number(status)) {
      case AppointmentStatus.conFirmed: return 'مؤكد';
      case AppointmentStatus.InProgress: return 'قيد المعاينة';
      case AppointmentStatus.Completed: return 'مكتمل';
      case AppointmentStatus.Cancelleted: return 'ملغى';
      default: return 'مؤكد';
    }
  }

  getStatusBadgeClass(status: AppointmentStatus | number): string {
    const num = Number(status);
    switch (num) {
      case 1: // Confirmed - primary blue
        return 'bg-primary/10 text-primary border border-primary/20';
      case 2: // InProgress - accent
        return 'bg-accent/10 text-accent border border-accent/20';
      case 3: // Completed - success
        return 'bg-success/10 text-success border border-success/20';
      case 4: // Cancelled - danger
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-primary/10 text-primary border border-primary/20';
    }
  }
}
