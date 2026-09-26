import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Doctor } from '@features/doctors/models/Doctor';
import { readDoctorPercentage } from '../../utils/appointment-pricing';

@Component({
  selector: 'app-doctor-percentage-info',
  imports: [DecimalPipe],
  template: `
    @if (doctor(); as selected) {
      <div
        class="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-text"
        role="status"
      >
        <p class="font-semibold">الطبيب المختار: {{ selected.fullName }}</p>
        @if (percentage() !== undefined) {
          <p class="mt-1">
            نسبة الطبيب: <strong>{{ percentage() | number: '1.0-2' }}%</strong>
          </p>
          <p class="mt-1 text-xs">يُخصم خصم المريض من حصة هذا الطبيب فقط.</p>
        } @else {
          <p class="mt-1">نسبة الطبيب غير متاحة. لا يمكن تطبيق خصم حتى تتوفر النسبة.</p>
        }
      </div>
    }
  `,
})
export class DoctorPercentageInfoComponent {
  readonly doctor = input<Doctor>();
  readonly percentage = computed(() => readDoctorPercentage(this.doctor()?.doctorPercentage));
}
