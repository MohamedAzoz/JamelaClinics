import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { finalize } from 'rxjs/operators';
import { Employee } from '../models/Employee';
import { UpdateEmployee } from '../models/UpdateEmployee';
import { EmployeeApiService } from './employee-api.service';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { RegisterEmployeeRequest } from '../../auth/models/RegisterEmployee';

@Service()
export class EmployeeFacade {
  private _employeeApiService = inject(EmployeeApiService);
  private _authApiService = inject(AuthApiService);
  private _messageService = inject(AppMessageService);

  // State Signals
  readonly employees = signal<Employee[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly activeFilter = signal<boolean | 'all'>('all');
  readonly selectedEmployee = signal<Employee | null>(null);

  // Modal Control Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly employeeToDelete = signal<Employee | null>(null);

  // Computed Derived Signals
  readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.activeFilter();
    let list = this.employees();

    if (status !== 'all') {
      list = list.filter((e) => e.isActive === status);
    }

    if (!term) return list;

    return list.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(term) ||
        emp.username.toLowerCase().includes(term)
    );
  });

  readonly totalCount = computed(() => this.employees().length);
  readonly activeCount = computed(() => this.employees().filter((e) => e.isActive).length);
  readonly inactiveCount = computed(() => this.employees().filter((e) => !e.isActive).length);

  /**
   * 1. API Wrap: EmployeeApiService.getAllEmployees
   */
  loadEmployees(isActive: boolean = true): void {
    this.loading.set(true);
    this._employeeApiService
      .getAllEmployees(isActive)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.employees.set(res.data);
          } else {
            const fallbackData = Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? (res as unknown as Employee[])
                : [];
            this.employees.set(fallbackData);
          }
        },
        error: (err) => {
          this._messageService.showHttpError(err, 'تعذر تحميل قائمة موظفي الاستقبال');
        },
      });
  }

  /**
   * 2. API Wrap: EmployeeApiService.getEmployeeByUserId
   */
  getEmployeeByUserId(userId: string): void {
    this.loading.set(true);
    this._employeeApiService
      .getEmployeeByUserId(userId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this.selectedEmployee.set(res.data);
          }
        },
        error: (err) => {
          this._messageService.showHttpError(err, 'تعذر تحميل بيانات الموظف');
        },
      });
  }

  /**
   * 3. API Wrap: AuthApiService.registerEmployee
   */
  registerEmployee(request: RegisterEmployeeRequest): void {
    this.actionLoading.set(true);
    this._authApiService
      .registerEmployee(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم تسجيل حساب الموظف بنجاح');
            this.closeFormModal();
            this.loadEmployees();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تسجيل حساب الموظف'
            );
          }
        },
        error: (err) => {
          this._messageService.showHttpError(err, 'فشلت عملية إضافة الموظف');
        },
      });
  }

  /**
   * 4. API Wrap: EmployeeApiService.updateEmployee
   */
  updateEmployee(request: UpdateEmployee): void {
    this.actionLoading.set(true);
    this._employeeApiService
      .updateEmployee(request)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم تحديث بيانات الموظف بنجاح');
            this.closeFormModal();
            this.loadEmployees();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تعديل بيانات الموظف'
            );
          }
        },
        error: (err) => {
          this._messageService.showHttpError(err, 'فشلت عملية تعديل بيانات الموظف');
        },
      });
  }

  /**
   * 5. API Wrap: EmployeeApiService.deleteEmployeeByUserId
   */
  deleteEmployee(userId: string): void {
    this.actionLoading.set(true);
    this._employeeApiService
      .deleteEmployeeByUserId(userId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage('تم حذف حساب الموظف بنجاح');
            this.closeDeleteModal();
            this.loadEmployees();
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'حدث خطأ أثناء تنفيذ عملية حذف الموظف'
            );
          }
        },
        error: (err) => {
          this._messageService.showHttpError(err, 'فشلت عملية حذف الموظف');
        },
      });
  }

  // --- UI & Modal Handlers ---

  openCreateModal(): void {
    this.selectedEmployee.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.selectedEmployee.set(null);
  }

  openDeleteModal(employee: Employee): void {
    this.employeeToDelete.set(employee);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.employeeToDelete.set(null);
  }

  confirmDelete(): void {
    const emp = this.employeeToDelete();
    if (emp) {
      this.deleteEmployee(emp.userId);
    }
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setActiveFilter(filter: boolean | 'all'): void {
    this.activeFilter.set(filter);
  }
}
