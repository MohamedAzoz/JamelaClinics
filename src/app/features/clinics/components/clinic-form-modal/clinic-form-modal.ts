import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHospital, faXmark, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ClinicFacade } from '../../services/clinic.facade';

@Component({
  selector: 'app-clinic-form-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './clinic-form-modal.html',
})
export class ClinicFormModalComponent {
  public facade = inject(ClinicFacade);
  private _fb = inject(FormBuilder);

  readonly faHospital = faHospital;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  form: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    // Synchronize form values whenever facade.selectedClinic signal changes
    effect(() => {
      const clinic = this.facade.selectedClinic();
      if (clinic) {
        this.form.patchValue({ name: clinic.name });
      } else {
        this.form.reset({ name: '' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.value.name;
    const selected = this.facade.selectedClinic();

    if (selected) {
      this.facade.updateClinic(selected.id, name);
    } else {
      this.facade.createClinic(name);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
