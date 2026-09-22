import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faXmark,
  faTrashCan,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorFacade } from '../../services/doctor.facade';

@Component({
  selector: 'app-doctor-delete-modal',
  imports: [FontAwesomeModule],
  templateUrl: './doctor-delete-modal.html',
})
export class DoctorDeleteModalComponent {
  public facade = inject(DoctorFacade);

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
