import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDay,
  faCheckCircle,
  faClipboardList,
  faExclamationTriangle,
  faMapMarkerAlt,
  faPhone,
  faReceipt,
  faSpinner,
  faTimes,
  faUser,
  faUserMd,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentStatus } from '../../models/AppointmentStatus';
import { VisitType } from '../../models/VisitType';

@Component({
  selector: 'app-appointment-details-modal',
  imports: [FontAwesomeModule, DecimalPipe, DatePipe],
  templateUrl: './appointment-details-modal.html',
})
export class AppointmentDetailsModalComponent {
  readonly facade = inject(AppointmentFacade);
  readonly appointmentId = input.required<number>();
  readonly closed = output<void>();

  readonly faTimes = faTimes;
  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faReceipt = faReceipt;
  readonly faWallet = faWallet;
  readonly faClipboardList = faClipboardList;
  readonly faCheckCircle = faCheckCircle;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly faSpinner = faSpinner;

  readonly hasMaterials = computed(
    () => (this.facade.appointmentDetails()?.materials?.length ?? 0) > 0,
  );

  readonly totalMaterialsCost = computed(
    () => this.facade.appointmentDetails()?.totalMaterialsCost ?? 0,
  );

  readonly appointment = computed(() => this.facade.appointmentDetails());

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

  constructor() {
    effect(() => {
      const id = this.appointmentId();
      if (id && id > 0) {
        this.facade.loadAppointmentDetails(id);
      }
    });
  }

  close(): void {
    this.facade.clearAppointmentDetails();
    this.closed.emit();
  }

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
