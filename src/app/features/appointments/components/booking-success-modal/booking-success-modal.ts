import { Component, inject, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faCalendarPlus,
  faTimes,
  faPrint,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';

@Component({
  selector: 'app-booking-success-modal',
  imports: [FontAwesomeModule],
  templateUrl: './booking-success-modal.html',
})
export class BookingSuccessModalComponent {
  readonly facade = inject(AppointmentFacade);

  readonly faCheckCircle = faCheckCircle;
  readonly faCalendarPlus = faCalendarPlus;
  readonly faTimes = faTimes;
  readonly faPrint = faPrint;
  readonly faUserCheck = faUserCheck;

  readonly appointment = computed(() => this.facade.lastBookedAppointment());

  closeModal(): void {
    this.facade.resetBookingState();
  }
}
