import { computed, effect, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { Expense } from '../models/Expense';
import { CreateExpense } from '../models/CreateExpense';
import { ReportExpense, TreasuryPeriod } from '../models/ReportExpense';
import { TreasuryApiService } from './treasury-api.service';
import { finalize } from 'rxjs';

@Service()
export class TreasuryFacade {
  private readonly _api = inject(TreasuryApiService);
  private readonly _messages = inject(AppMessageService);
  private readonly _initialized = signal(false);

  readonly expenses = signal<Expense[]>([]);
  readonly summary = signal<import('../models/TreasurySummary').TreasurySummary | null>(null);
  readonly loading = signal(false);
  readonly actionLoading = signal(false);
  readonly filters = signal<ReportExpense>({
    pageNumber: 1,
    pageSize: 10,
  });
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly selectedExpense = signal<Expense | null>(null);
  readonly isFormModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);
  readonly expenseToDelete = signal<Expense | null>(null);
  readonly hasExpenses = computed(() => this.expenses().length > 0);

  constructor() {
    effect(() => {
      const currentFilters = this.filters();
      if (this._initialized()) this.loadData(currentFilters);
    });
  }

  initialize(): void {
    this._initialized.set(true);
  }

  loadData(filters = this.filters()): void {
    this.loading.set(true);
    this._api
      .getReport(filters)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const report = response?.data;
          this.expenses.set(report?.items ?? []);
          this.totalCount.set(report?.totalCount ?? 0);
          this.totalPages.set(report?.totalPages ?? 0);
        },
        error: (error) => this._messages.showHttpError(error, 'تعذر تحميل تقرير المصروفات'),
      });

    this._api.getSummary(filters).subscribe({
      next: (response) => this.summary.set(response?.data ?? null),
      error: (error) => this._messages.showHttpError(error, 'تعذر تحميل ملخص الخزينة'),
    });
  }

  setFilters(filters: ReportExpense): void {
    this.filters.set({ ...filters, pageNumber: 1 });
  }

  setPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages()) return;
    this.filters.update((current) => ({ ...current, pageNumber }));
  }

  setPageSize(pageSize: number): void {
    this.filters.update((current) => ({ ...current, pageSize, pageNumber: 1 }));
  }

  resetAllFilters(): void {
    const pageSize = this.filters().pageSize ?? 10;
    this.filters.set({ pageNumber: 1, pageSize });
  }

  openCreateModal(): void {
    this.selectedExpense.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(expense: Expense): void {
    this.selectedExpense.set(expense);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedExpense.set(null);
  }

  openDeleteModal(expense: Expense): void {
    this.expenseToDelete.set(expense);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.expenseToDelete.set(null);
  }

  createExpense(expense: CreateExpense): void {
    this.runMutation(this._api.postExpense(expense), 'تمت إضافة المصروف بنجاح');
  }

  updateExpense(id: number, expense: CreateExpense): void {
    this.runMutation(this._api.putExpense(id, expense), 'تم تعديل المصروف بنجاح');
  }

  deleteExpense(id: number): void {
    this.runMutation(this._api.deleteExpense(id), 'تم حذف المصروف بنجاح', true);
  }

  private runMutation(
    request: ReturnType<TreasuryApiService['postExpense']>,
    successMessage: string,
    isDelete = false,
  ): void {
    this.actionLoading.set(true);
    request.pipe(finalize(() => this.actionLoading.set(false))).subscribe({
      next: (response) => {
        if (!response?.isSuccess) {
          this._messages.addErrorMessage(response?.message || 'تعذر تنفيذ العملية');
          return;
        }
        this._messages.addSuccessMessage(response.message || successMessage);
        if (isDelete) this.closeDeleteModal();
        else this.closeFormModal();
        this.loadData();
      },
      error: (error) => this._messages.showHttpError(error, 'تعذر تنفيذ عملية المصروف'),
    });
  }
}
