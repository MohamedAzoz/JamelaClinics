import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserTie,
  faXmark,
  faCheck,
  faSpinner,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeFacade } from '../../services/employee.facade';
import { UpdateEmployee } from '../../models/UpdateEmployee';
import { RegisterEmployeeRequest } from '@features/auth/models/RegisterEmployee';

@Component({
  selector: 'app-employee-form-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './employee-form-modal.html',
})
export class EmployeeFormModalComponent {
  public facade = inject(EmployeeFacade);
  private _fb = inject(FormBuilder);

  readonly faUserTie = faUserTie;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faLock = faLock;
  readonly faUser = faUser;

  createForm: FormGroup = this._fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  editForm: FormGroup = this._fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const selected = this.facade.selectedEmployee();
      if (selected) {
        this.editForm.patchValue({
          fullName: selected.fullName,
          isActive: selected.isActive,
        });
      } else {
        this.createForm.reset({
          fullName: '',
          username: '',
          password: '',
        });
      }
    });
  }

  onSubmit(): void {
    const isEdit = !!this.facade.selectedEmployee();

    if (isEdit) {
      if (this.editForm.invalid) {
        this.editForm.markAllAsTouched();
        return;
      }
      const selected = this.facade.selectedEmployee()!;
      const val = this.editForm.value;
      const request: UpdateEmployee = {
        userId: selected.userId,
        fullName: val.fullName,
        isActive: !!val.isActive,
      };
      this.facade.updateEmployee(request);
    } else {
      if (this.createForm.invalid) {
        this.createForm.markAllAsTouched();
        return;
      }
      const val = this.createForm.value;
      const request: RegisterEmployeeRequest = {
        fullName: val.fullName,
        username: val.username,
        password: val.password,
      };
      this.facade.registerEmployee(request);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
