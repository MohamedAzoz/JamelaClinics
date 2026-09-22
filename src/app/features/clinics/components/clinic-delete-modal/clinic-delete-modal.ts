import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faXmark,
  faTrashCan,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ClinicFacade } from '../../services/clinic.facade';

@Component({
  selector: 'app-clinic-delete-modal',
  imports: [FontAwesomeModule],
  templateUrl: './clinic-delete-modal.html',
})
export class ClinicDeleteModalComponent {
  public facade = inject(ClinicFacade);

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
