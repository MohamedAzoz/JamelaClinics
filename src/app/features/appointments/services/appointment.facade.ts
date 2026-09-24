import { computed, inject, Service, signal } from '@angular/core';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { DoctorScheduleApiService } from '@features/doctorSchedules/services/doctor-schedule-api.service';
import { AppointmentApiService } from './appointment-api.service';
import { Doctor } from '@features/doctors/models/Doctor';
import { DoctorSchedule } from '@features/doctorSchedules/models/DoctorSchedule';
import { Appointments } from '../models/Appointments';
import { FilterAppointment, FilterAppointmentsForExcel } from '../models/FilterAppointment';
import { CreateAppointments } from '../models/CreateAppointments';
import { Period } from '../models/Period';
import { AppMessageService } from '@core/services/app-message-service';

@Service()
export class AppointmentFacade {
  private readonly _doctorApiService = inject(DoctorApiService);
  private readonly _scheduleApiService = inject(DoctorScheduleApiService);
  private readonly _appointmentApiService = inject(AppointmentApiService);
  private readonly _toast = inject(AppMessageService);

  // ==========================================
  // Doctor & Schedule Selection State (Booking)
  // ==========================================
  readonly doctors = signal<Doctor[]>([]);
  readonly selectedDoctorId = signal<string>('');
  readonly schedules = signal<DoctorSchedule[]>([]);

  readonly isLoadingDoctors = signal<boolean>(false);
  readonly isLoadingSchedules = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly bookingSuccess = signal<boolean>(false);
  readonly lastBookedAppointment = signal<CreateAppointments | null>(null);

  // ==========================================
  // Appointments Management & List State
  // ==========================================
  readonly appointments = signal<Appointments[]>([]);
  readonly totalCount = signal<number>(0);
  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalPages = signal<number>(1);

  readonly isLoadingAppointments = signal<boolean>(false);
  readonly isExportingExcel = signal<boolean>(false);

  // Filter Signals
  readonly periodFilter = signal<Period | undefined>(undefined);
  readonly fromDateFilter = signal<string>('');
  readonly toDateFilter = signal<string>('');

  // ==========================================
  // Computed Reactive States
  // ==========================================
  readonly selectedDoctor = computed(
    () => this.doctors().find((d) => d.userId === this.selectedDoctorId()) ?? null,
  );

  readonly hasAvailableSchedules = computed(() => this.schedules().length > 0);

  /**
   * Filtered appointments applying search, doctor, visit type, status, and payment filters locally.
   */
  readonly filteredAppointments = computed(() => {
    let list = this.appointments();
    return list;
  });

  // Summary Metrics
  readonly totalFeeSum = computed(() =>
    this.filteredAppointments().reduce((acc, curr) => acc + (curr.consultationFee || 0), 0),
  );

  readonly totalDoctorEarningsSum = computed(() =>
    this.filteredAppointments().reduce((acc, curr) => acc + (curr.doctorEarnings || 0), 0),
  );

  readonly totalCenterEarningsSum = computed(() =>
    this.filteredAppointments().reduce((acc, curr) => acc + (curr.centerEarnings || 0), 0),
  );

  readonly paidAppointmentsCount = computed(
    () => this.filteredAppointments().filter((a) => a.isPaid).length,
  );

  readonly unpaidAppointmentsCount = computed(
    () => this.filteredAppointments().filter((a) => !a.isPaid).length,
  );

  // ==========================================
  // Booking Form Actions & API Wrappers
  // ==========================================
  async initBooking(): Promise<void> {
    await this.loadActiveDoctors();
  }

  async loadActiveDoctors(): Promise<void> {
    this.isLoadingDoctors.set(true);
    this._doctorApiService.getAllDoctors(true).subscribe({
      next: (res) => {
        this.isLoadingDoctors.set(false);
        if (res.isSuccess && res.data) {
          this.doctors.set(res.data);
        } else {
          this.doctors.set([]);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الأطباء المتاحين');
        }
      },
      error: () => {
        this.isLoadingDoctors.set(false);
        this.doctors.set([]);
        this._toast.addErrorMessage('حدث خطأ أثناء الاتصال بالخادم لجلب الأطباء');
      },
    });
  }

  selectDoctor(doctorId: string): void {
    this.selectedDoctorId.set(doctorId);
    this.schedules.set([]);
    if (!doctorId) return;

    this.loadDoctorSchedules(doctorId);
  }

  loadDoctorSchedules(doctorId: string): void {
    this.isLoadingSchedules.set(true);
    this._scheduleApiService.getDoctorScheduleByDoctorId(doctorId, true, true).subscribe({
      next: (res) => {
        this.isLoadingSchedules.set(false);
        if (res.isSuccess && res.data) {
          this.schedules.set(res.data);
        } else {
          this.schedules.set([]);
          this._toast.addErrorMessage(res.message || 'لا توجد مواعيد متاحة لهذا الطبيب');
        }
      },
      error: () => {
        this.isLoadingSchedules.set(false);
        this.schedules.set([]);
        this._toast.addErrorMessage('حدث خطأ أثناء جلب مواعيد الطبيب');
      },
    });
  }

  async createAppointment(data: CreateAppointments): Promise<boolean> {
    this.isSubmitting.set(true);

    return new Promise<boolean>((resolve) => {
      this._appointmentApiService.createAppointments(data).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.isSuccess) {
            this._toast.addSuccessMessage(res.message || 'تم حجز الموعد للمريض بنجاح');
            this.lastBookedAppointment.set(data);
            this.bookingSuccess.set(true);
            resolve(true);
          } else {
            this._toast.addErrorMessage(res.message || 'فشل في إضافة بيانات الحجز');
            resolve(false);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          this._toast.addErrorMessage('حدث خطأ غير متوقع عند إجراء عملية الحجز');
          resolve(false);
        },
      });
    });
  }

  resetBookingState(): void {
    this.bookingSuccess.set(false);
    this.lastBookedAppointment.set(null);
  }

  // ==========================================
  // Appointments Management & Listing Actions
  // ==========================================
  async initAppointmentsManagement(): Promise<void> {
    await this.loadActiveDoctors();
    await this.loadAppointments();
  }

  /**
   * Fetches all appointments via AppointmentApiService.getAllAppointments(filter)
   */
  async loadAppointments(): Promise<void> {
    this.isLoadingAppointments.set(true);

    const filter: FilterAppointment = {
      Period: this.periodFilter(),
      FromDate: this.fromDateFilter() ? this.fromDateFilter() : undefined,
      ToDate: this.toDateFilter() ? this.toDateFilter() : undefined,
      PageNumber: this.pageNumber(),
      PageSize: this.pageSize(),
    };

    this._appointmentApiService.getAllAppointments(filter).subscribe({
      next: (res) => {
        this.isLoadingAppointments.set(false);
        if (res.isSuccess && res.data) {
          const paginated = res.data;
          this.appointments.set(paginated.items || []);
          this.totalCount.set(
            paginated.totalCount || (paginated.items ? paginated.items.length : 0),
          );
          this.totalPages.set(paginated.totalPages || 1);
        } else {
          this.appointments.set([]);
          this.totalCount.set(0);
          this.totalPages.set(1);
          this._toast.addErrorMessage(res.message || 'فشل في جلب قائمة الحجوزات');
        }
      },
      error: () => {
        this.isLoadingAppointments.set(false);
        this.appointments.set([]);
        this.totalCount.set(0);
        this.totalPages.set(1);
        this._toast.addErrorMessage('حدث خطأ أثناء تحميل سجل الحجوزات');
      },
    });
  }

  /**
   * Exports appointments report via AppointmentApiService.getExportAppointments(filter)
   */
  exportAppointmentsExcel(): void {
    this.isExportingExcel.set(true);

    const filter: FilterAppointmentsForExcel = {
      Period: this.periodFilter(),
      FromDate: this.fromDateFilter() ? this.fromDateFilter() : undefined,
      ToDate: this.toDateFilter() ? this.toDateFilter() : undefined,
    };

    this._appointmentApiService.getExportAppointments(filter).subscribe({
      next: (blob) => {
        this.isExportingExcel.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير_الحجوزات_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this._toast.addSuccessMessage('تم تصدير تقرير الحجوزات بنجاح');
      },
      error: () => {
        this.isExportingExcel.set(false);
        this._toast.addErrorMessage('حدث خطأ أثناء تصدير ملف الاكسل');
      },
    });
  }

  // ==========================================
  // Filter Handlers
  // ==========================================
  setPeriodFilter(period?: Period): void {
    this.periodFilter.set(period);
    if (period !== undefined) {
      this.fromDateFilter.set('');
      this.toDateFilter.set('');
    }
    this.pageNumber.set(1);
    this.loadAppointments();
  }

  setDateRangeFilter(fromDate: string, toDate: string): void {
    this.fromDateFilter.set(fromDate);
    this.toDateFilter.set(toDate);
    if (fromDate || toDate) {
      this.periodFilter.set(undefined);
    }
    this.pageNumber.set(1);
    this.loadAppointments();
  }

  setPageNumber(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    this.loadAppointments();
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.pageNumber.set(1);
    this.loadAppointments();
  }

  resetAllFilters(): void {
    this.periodFilter.set(undefined);
    this.fromDateFilter.set('');
    this.toDateFilter.set('');
    this.pageNumber.set(1);
    this.loadAppointments();
  }
}
