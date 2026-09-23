import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarPlus,
  faUserMd,
  faCalendarDays,
  faCheckCircle,
  faTimesCircle,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-schedule-toolbar',
  imports: [FontAwesomeModule],
  templateUrl: './schedule-toolbar.html',
})
export class ScheduleToolbarComponent {
  public facade = inject(DoctorScheduleFacade);

  readonly faCalendarPlus = faCalendarPlus;
  readonly faUserMd = faUserMd;
  readonly faCalendarDays = faCalendarDays;
  readonly faCheckCircle = faCheckCircle;
  readonly faTimesCircle = faTimesCircle;
  readonly faStethoscope = faStethoscope;

  onDoctorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.facade.selectDoctor(select.value);
    }
  }
}
