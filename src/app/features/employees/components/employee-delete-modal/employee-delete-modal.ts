import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faXmark,
  faTrashCan,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeFacade } from '../../services/employee.facade';

@Component({
  selector: 'app-employee-delete-modal',
  imports: [FontAwesomeModule],
  templateUrl: './employee-delete-modal.html',
})
export class EmployeeDeleteModalComponent {
  public facade = inject(EmployeeFacade);

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
