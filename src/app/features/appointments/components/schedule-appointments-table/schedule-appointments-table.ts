import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  faCheck,
  faBan,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { VisitType } from '../../models/VisitType';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { Appointments } from '../../models/Appointments';
import { EditAppointmentModalComponent } from '../edit-appointment-modal/edit-appointment-modal';

@Component({
  selector: 'app-schedule-appointments-table',
  imports: [FontAwesomeModule, DatePipe, EditAppointmentModalComponent],
  templateUrl: './schedule-appointments-table.html',
})
export class ScheduleAppointmentsTableComponent {
  readonly facade = inject(AppointmentFacade);

  readonly Number = Number;

  readonly editingAppointment = signal<Appointments | null>(null);

  // Icons
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
  readonly faCheck = faCheck;
  readonly faBan = faBan;
  readonly faEdit = faEdit;

  openEditModal(app: Appointments): void {
    this.facade.selectedDoctorId.set('');
    this.facade.schedules.set([]);
    this.editingAppointment.set(app);
  }

  closeEditModal(): void {
    this.editingAppointment.set(null);
  }

  getVisitTypeName(type: VisitType | number): string {
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
        return 'فراكشن';
      default:
        return 'كشف';
    }
  }

  getStatusName(status: AppointmentStatus | number): string {
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

  getStatusBadgeClass(status: AppointmentStatus | number): string {
    const num = Number(status);
    switch (num) {
      case 1: // Unpaid
        return 'bg-warning/10 text-warning border border-warning/20';
      case 2: // InProgress
        return 'bg-accent/10 text-accent border border-accent/20';
      case 3: // Completed
        return 'bg-success/10 text-success border border-success/20';
      case 4: // Cancelled
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-warning/10 text-warning border border-warning/20';
    }
  }
}
