import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { Period } from '../../models/Period';

@Component({
  selector: 'app-appointment-filter',
  imports: [FontAwesomeModule],
  templateUrl: './appointment-filter.html',
})
export class AppointmentFilterComponent {
  readonly facade = inject(AppointmentFacade);

  // FontAwesome Icons
  readonly faCalendarAlt = faCalendarAlt;
  readonly faUndo = faUndo;

  readonly PeriodEnum = Period;

  // Local inputs for custom date range
  readonly fromDate = signal<string>('');
  readonly toDate = signal<string>('');

  onPeriodSelect(period?: Period): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.facade.setPeriodFilter(period);
  }

  onDateRangeApply(): void {
    this.facade.setDateRangeFilter(this.fromDate(), this.toDate());
  }

  resetAll(): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.facade.resetAllFilters();
  }
}
