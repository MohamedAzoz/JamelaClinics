import { Component, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxOpen,
  faExclamationTriangle,
  faPlus,
  faSpinner,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { AddMaterialToAppointment } from '../../models/AddMaterialToAppointment';

@Component({
  selector: 'app-appointment-materials-section',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './appointment-materials-section.html',
})
export class AppointmentMaterialsSectionComponent {
  readonly facade = inject(AppointmentFacade);
  readonly appointment = input.required<AppointmentsMaterial>();

  // FontAwesome Icons
  readonly faBoxOpen = faBoxOpen;
  readonly faPlus = faPlus;
  readonly faTrashAlt = faTrashAlt;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly faSpinner = faSpinner;

  // Form State
  readonly selectedMaterialId = signal<number | null>(null);
  readonly quantity = signal<number>(1);

  readonly hasMaterials = computed(
    () => (this.appointment()?.materials?.length ?? 0) > 0,
  );

  readonly selectedMaterial = computed(() => {
    const id = this.selectedMaterialId();
    if (!id) return null;
    return this.facade.availableMaterials().find((m) => m.id === id) ?? null;
  });

  onMaterialSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedMaterialId.set(val ? Number(val) : null);
  }

  onQuantityChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.quantity.set(val > 0 ? val : 1);
  }

  async addMaterial(event: Event): Promise<void> {
    event.preventDefault();

    const matId = this.selectedMaterialId();
    const qty = this.quantity();

    if (!matId || qty < 1 || this.facade.isAddingMaterial()) return;

    const payload: AddMaterialToAppointment = {
      appointmentId: this.appointment().id,
      materialId: matId,
      quantity: qty,
    };

    const ok = await this.facade.addMaterialToAppointment(payload);
    if (ok) {
      this.selectedMaterialId.set(null);
      this.quantity.set(1);
    }
  }

  async removeMaterial(appointmentMaterialId: number): Promise<void> {
    if (this.facade.removingMaterialId() !== null) return;
    await this.facade.removeMaterialFromAppointment(
      appointmentMaterialId,
      this.appointment().id,
    );
  }
}
