import { computed, inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { ROLES } from '@shared/constants/roles.constants';
import { CreateSpecialOffer } from '../models/CreateSpecialOffer';
import { CreateSpecialOfferResponse } from '../models/CreateSpecialOfferResponse';
import { SpecialOffersApiService } from './special-offers-api.service';

@Service()
export class SpecialOffersFacade {
  private readonly api = inject(SpecialOffersApiService);
  private readonly messages = inject(AppMessageService);
  private readonly identity = inject(IdentityService);

  readonly isManager = computed(
    () => this.identity.userRole() === ROLES.Admin || this.identity.userRole() === ROLES.Accountant,
  );
  readonly isReception = computed(() => this.identity.userRole() === ROLES.Reception);
  readonly offers = signal<CreateSpecialOfferResponse[]>([]);
  readonly selectedOffer = signal<CreateSpecialOfferResponse | null>(null);
  readonly offerToDelete = signal<CreateSpecialOfferResponse | null>(null);
  readonly selectedOfferDetails = signal<CreateSpecialOfferResponse | null>(null);
  readonly isLoading = signal(false);
  readonly isLoadingDetails = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);
  readonly isFormOpen = signal(false);
  readonly error = signal('');
  readonly detailsError = signal('');

  async loadOffers(): Promise<void> {
    this.isLoading.set(true);
    this.error.set('');
    try {
      const response = await firstValueFrom(
        this.api.getAllSpecialOffers(this.isReception() ? true : undefined),
      );
      if (!response.isSuccess) throw new Error(response.message);
      this.offers.set(response.data ?? []);
    } catch {
      this.offers.set([]);
      this.error.set('تعذر تحميل الخصومات. حاول تحديث الصفحة.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadOfferDetails(id: number): Promise<void> {
    this.selectedOfferDetails.set(null);
    this.detailsError.set('');
    if (!Number.isSafeInteger(id) || id < 1) {
      this.detailsError.set('رقم الخصم غير صحيح.');
      return;
    }

    this.isLoadingDetails.set(true);
    try {
      const response = await firstValueFrom(this.api.getSpecialOfferById(id));
      if (!response.isSuccess || !response.data) throw new Error(response.message);
      this.selectedOfferDetails.set(response.data);
    } catch {
      this.detailsError.set('تعذر تحميل تفاصيل الخصم. تحقق من الرقم وحاول مرة أخرى.');
    } finally {
      this.isLoadingDetails.set(false);
    }
  }

  openCreateForm(): void {
    if (!this.isManager()) return;
    this.selectedOffer.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(offer: CreateSpecialOfferResponse): void {
    if (!this.isManager()) return;
    this.selectedOffer.set(offer);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    if (this.isSaving()) return;
    this.isFormOpen.set(false);
    this.selectedOffer.set(null);
  }

  async saveOffer(offer: CreateSpecialOffer): Promise<void> {
    if (!this.isManager() || this.isSaving()) return;
    this.isSaving.set(true);
    try {
      const selected = this.selectedOffer();
      const response = selected
        ? await firstValueFrom(this.api.updateSpecialOffer({ ...selected, ...offer }))
        : await firstValueFrom(this.api.createSpecialOffer(offer));
      if (!response.isSuccess) throw new Error(response.message);
      this.messages.addSuccessMessage(selected ? 'تم تعديل الخصم بنجاح' : 'تمت إضافة الخصم بنجاح');
      this.isFormOpen.set(false);
      this.selectedOffer.set(null);
      await this.loadOffers();
    } catch (error) {
      this.messages.showHttpError(error, 'تعذر حفظ بيانات الخصم');
    } finally {
      this.isSaving.set(false);
    }
  }

  requestDelete(offer: CreateSpecialOfferResponse): void {
    if (this.isManager()) this.offerToDelete.set(offer);
  }

  cancelDelete(): void {
    if (!this.isDeleting()) this.offerToDelete.set(null);
  }

  async deleteOffer(): Promise<void> {
    const offer = this.offerToDelete();
    if (!this.isManager() || !offer || this.isDeleting()) return;
    this.isDeleting.set(true);
    try {
      const response = await firstValueFrom(this.api.deleteSpecialOffer(offer.id));
      if (!response.isSuccess || response.data !== true) throw new Error(response.message);
      this.messages.addSuccessMessage('تم حذف الخصم بنجاح');
      this.offerToDelete.set(null);
      await this.loadOffers();
    } catch (error) {
      this.messages.showHttpError(error, 'تعذر حذف الخصم');
    } finally {
      this.isDeleting.set(false);
    }
  }

  async toggleStatus(offer: CreateSpecialOfferResponse): Promise<void> {
    if (!this.isManager()) return;
    try {
      const response = await firstValueFrom(this.api.toggleSpecialOfferStatus(offer.id));
      if (!response.isSuccess || response.data !== true) throw new Error(response.message);
      this.messages.addSuccessMessage(offer.isActive ? 'تم إيقاف الخصم' : 'تم تفعيل الخصم');
      await this.loadOffers();
    } catch (error) {
      this.messages.showHttpError(error, 'تعذر تغيير حالة الخصم');
    }
  }
}
