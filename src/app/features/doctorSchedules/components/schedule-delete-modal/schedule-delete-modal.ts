import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faXmark,
  faTrashCan,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-schedule-delete-modal',
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './schedule-delete-modal.html',
})
export class ScheduleDeleteModalComponent {
  public facade = inject(DoctorScheduleFacade);

  readonly faTriangleExclamation = faTriangleExclamation;
  readonly faXmark = faXmark;
  readonly faTrashCan = faTrashCan;
  readonly faSpinner = faSpinner;

  confirm(): void {
    this.facade.confirmDelete();
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
