import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faXmark,
  faCheck,
  faSpinner,
  faLock,
  faUser,
  faHospital,
  faPercent,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorFacade } from '../../services/doctor.facade';
import { UpdateDoctorRequest } from '../../models/UpdateDoctorRequest';
import { RegisterDoctorRequest } from '@features/auth/models/RegisterDoctorRequest';

@Component({
  selector: 'app-doctor-form-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './doctor-form-modal.html',
})
export class DoctorFormModalComponent {
  public facade = inject(DoctorFacade);
  private _fb = inject(FormBuilder);

  readonly faUserMd = faUserMd;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faLock = faLock;
  readonly faUser = faUser;
  readonly faHospital = faHospital;
  readonly faPercent = faPercent;

  createForm: FormGroup = this._fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    clinicId: [null, [Validators.required]],
  });

  editForm: FormGroup = this._fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    clinicId: [null, [Validators.required]],
    doctorPercentage: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const selected = this.facade.selectedDoctor();
      if (selected) {
        this.editForm.patchValue({
          fullName: selected.fullName,
          clinicId: selected.clinicId,
          doctorPercentage: selected.doctorPercentage ?? 70,
          isActive: selected.isActive,
        });
      } else {
        this.createForm.reset({
          fullName: '',
          username: '',
          password: '',
          clinicId: null,
        });
      }
    });
  }

  onSubmit(): void {
    const isEdit = !!this.facade.selectedDoctor();

    if (isEdit) {
      if (this.editForm.invalid) {
        this.editForm.markAllAsTouched();
        return;
      }
      const selected = this.facade.selectedDoctor()!;
      const val = this.editForm.value;
      const request: UpdateDoctorRequest = {
        userId: selected.userId,
        fullName: val.fullName,
        clinicId: Number(val.clinicId),
        doctorPercentage: Number(val.doctorPercentage),
        isActive: !!val.isActive,
      };
      this.facade.updateDoctor(request);
    } else {
      if (this.createForm.invalid) {
        this.createForm.markAllAsTouched();
        return;
      }
      const val = this.createForm.value;
      const request: RegisterDoctorRequest = {
        fullName: val.fullName,
        username: val.username,
        password: val.password,
        clinicId: Number(val.clinicId),
      };
      this.facade.registerDoctor(request);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
