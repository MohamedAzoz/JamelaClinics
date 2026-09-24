import { Component, inject, output, signal, effect, computed } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  min,
  minLength,
  required,
  validate,
  disabled,
} from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faUserMd,
  faCalendarDay,
  faMoneyBillWave,
  faCheckCircle,
  faSpinner,
  faStethoscope,
  faCoins,
  faCreditCard,
  faCalendarCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { CreateAppointments } from '../../models/CreateAppointments';
import { VisitType } from '../../models/VisitType';
import { DatePipe } from '@angular/common';

export interface BookingFormModel {
  doctorId: string;
  doctorScheduleId: string;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: number;
  consultationFee: number;
  isPaid: boolean;
}

@Component({
  selector: 'app-booking-form',
  imports: [FormField, FormRoot, FontAwesomeModule, DatePipe],
  templateUrl: './booking-form.html',
})
export class BookingFormComponent {
  readonly facade = inject(AppointmentFacade);

  // Output for form values sync (for live summary card)
  readonly formValueChange = output<BookingFormModel>();

  // FontAwesome Icons
  readonly faUser = faUser;
  readonly faPhone = faPhone;
  readonly faMapMarkerAlt = faMapMarkerAlt;
  readonly faUserMd = faUserMd;
  readonly faCalendarDay = faCalendarDay;
  readonly faMoneyBillWave = faMoneyBillWave;
  readonly faCheckCircle = faCheckCircle;
  readonly faSpinner = faSpinner;
  readonly faStethoscope = faStethoscope;
  readonly faCoins = faCoins;
  readonly faCreditCard = faCreditCard;
  readonly faCalendarCheck = faCalendarCheck;
  readonly faChevronDown = faChevronDown;

  // Visit Types Enum options
  readonly visitTypeOptions = [
    {
      value: VisitType.NewConsultation,
      label: 'كشف جديد',
      icon: 'faStethoscope',
      desc: 'معاينة وفحص أول مرة',
    },
    {
      value: VisitType.FollowUp,
      label: 'إعادة',
      icon: 'faCalendarCheck',
      desc: 'متابعة بعد الكشف',
    },
    {
      value: VisitType.Sessions,
      label: 'جلسات علاجية',
      icon: 'faUserCheck',
      desc: 'جلسات متابعة مستمرة',
    },
    { value: VisitType.Laser, label: 'ليزر', icon: 'faCoins', desc: 'جلسات التجميل والليزر' },
    {
      value: VisitType.Fractional,
      label: 'فراكشنال',
      icon: 'faCreditCard',
      desc: 'جلسات الجلدية والعناية',
    },
  ];

  // Signal Form Model
  protected readonly _model = signal<BookingFormModel>({
    doctorId: '',
    doctorScheduleId: '',
    patientName: '',
    patientPhoneNumber: '',
    patientAddress: '',
    visitType: VisitType.NewConsultation,
    consultationFee: 0,
    isPaid: false,
  });

  readonly model = this._model.asReadonly();

  readonly bookingForm = form(this._model, (path) => {
    required(path.doctorId, { message: 'يرجى اختيار الطبيب' });

    required(path.doctorScheduleId, { message: 'يرجى اختيار تاريخ وموعد الحجز' });
    disabled(
      path.doctorScheduleId,
      () => !this.facade.selectedDoctorId() || this.facade.isLoadingSchedules(),
    );

    required(path.patientName, { message: 'اسم المريض مطلوب' });
    minLength(path.patientName, 3, { message: 'اسم المريض يجب أن يتكون من 3 أحرف على الأقل' });

    required(path.patientPhoneNumber, { message: 'رقم هاتف المريض مطلوب' });
    minLength(path.patientPhoneNumber, 8, {
      message: 'رقم الهاتف يجب أن يتكون من 8 أرقام على الأقل',
    });

    required(path.consultationFee, { message: 'قيمة الكشف / الحجز مطلوبة' });
    min(path.consultationFee, 0, { message: 'القيمة يجب أن تكون 0 أو أكثر' });
  });

  constructor() {
    // Notify parent / summary of form value updates whenever model changes
    effect(() => {
      const current = this._model();
      this.formValueChange.emit(current);
    });
  }

  onDoctorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const doctorId = select.value;

    // Update model doctorId and clear doctorScheduleId
    this._model.update((m) => ({
      ...m,
      doctorId,
      doctorScheduleId: '',
    }));

    // Trigger facade doctor selection
    this.facade.selectDoctor(doctorId);
  }

  onScheduleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this._model.update((m) => ({
      ...m,
      doctorScheduleId: select.value || '',
    }));
  }

  onVisitTypeSelect(type: VisitType): void {
    this._model.update((m) => ({
      ...m,
      visitType: type,
    }));
  }

  onPaidToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._model.update((m) => ({
      ...m,
      isPaid: input.checked,
    }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.bookingForm().invalid() || this.facade.isSubmitting()) {
      this.bookingForm().markAsTouched();
      return;
    }

    const val = this._model();

    if (!val.doctorScheduleId || Number(val.doctorScheduleId) <= 0) {
      return;
    }

    const payload: CreateAppointments = {
      patientName: val.patientName.trim(),
      patientPhoneNumber: val.patientPhoneNumber.trim(),
      patientAddress: val.patientAddress.trim(),
      visitType: Number(val.visitType) as VisitType,
      doctorScheduleId: Number(val.doctorScheduleId),
      consultationFee: Number(val.consultationFee),
      isPaid: Boolean(val.isPaid),
    };

    const ok = await this.facade.createAppointment(payload);
    if (ok) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this._model.set({
      doctorId: '',
      doctorScheduleId: '',
      patientName: '',
      patientPhoneNumber: '',
      patientAddress: '',
      visitType: VisitType.NewConsultation,
      consultationFee: 0,
      isPaid: false,
    });
    this.facade.selectedDoctorId.set('');
    this.facade.schedules.set([]);
  }
}
