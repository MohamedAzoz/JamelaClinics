import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBedPulse,
  faBookMedical,
  faBox,
  faCalendar,
  faCalendarCheck,
  faCoins,
  faFileMedical,
  faFlask,
  faGear,
  faHospital,
  faMedkit,
  faPeopleGroup,
  faTableCellsLarge,
  faTram,
  faUserDoctor,
  faUsers,
  faUserTie,
  faWheelchair,
  faXRay,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full',
  },
  imports: [FontAwesomeModule],
})
export class SvgIconComponent {
  icon = input.required<string>();

  faSchedule = faCalendar;
  faDashboard = faTableCellsLarge;
  faPatients = faBedPulse;
  faDoctors = faUserDoctor;
  faClinics = faHospital;
  faAppointments = faBookMedical;
  faQueue = faPeopleGroup;
  faVisits = faWheelchair;
  faLab = faFlask;
  faRadiology = faXRay;
  faPharmacy = faMedkit;
  faPayment = faCoins;
  faUsers = faUsers;
  faReports = faFileMedical;
  faSettings = faGear;
  faRequests = faCalendarCheck;
  faAssistant = faUserTie;
  faInventory = faBox;
  // حاجة للاجويه التالف
  faInventoryDamaged = faTram;
}
