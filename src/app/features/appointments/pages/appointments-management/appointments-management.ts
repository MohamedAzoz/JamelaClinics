import { Component, inject, OnInit } from '@angular/core';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentListHeaderComponent } from '../../components/appointment-list-header/appointment-list-header';
import { AppointmentFilterComponent } from '../../components/appointment-filter/appointment-filter';
import { AppointmentTableComponent } from '../../components/appointment-table/appointment-table';
import { AppointmentPaginationComponent } from '../../components/appointment-pagination/appointment-pagination';

@Component({
  selector: 'app-appointments-management',
  providers: [AppointmentFacade],
  imports: [
    AppointmentListHeaderComponent,
    AppointmentFilterComponent,
    AppointmentTableComponent,
    AppointmentPaginationComponent,
  ],
  templateUrl: './appointments-management.html',
})
export class AppointmentsManagementPage implements OnInit {
  readonly facade = inject(AppointmentFacade);

  ngOnInit(): void {
    this.facade.initAppointmentsManagement();
  }
}
