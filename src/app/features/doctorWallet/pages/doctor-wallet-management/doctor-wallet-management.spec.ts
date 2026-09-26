import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { DoctorWalletManagementPage } from './doctor-wallet-management';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { Period } from '../../models/Period';
import { routes } from '../../../../app.routes';
import { ROLES } from '@shared/constants/roles.constants';
import {
  ADMIN_NAV_ITEMS,
  ACCOUNTANT_NAV_ITEMS,
  DOCTOR_NAV_ITEMS,
  RECEPTIONIST_NAV_ITEMS,
} from '@core/config/sideBar.config';

describe('Doctor wallet management', () => {
  let fixture: ComponentFixture<DoctorWalletManagementPage>;
  let facade: DoctorWalletFacade;
  let http: HttpTestingController;
  const isAdmin = signal(true);
  const isAccountant = signal(false);
  const isDoctor = signal(false);
  const userId = signal('doctor-1');
  const userName = signal('أحمد علي');
  const messages = { addSuccessMessage: vi.fn(), showHttpError: vi.fn() };
  const doctor = { doctorId: 'doctor-1', doctorName: 'أحمد علي' };
  const transaction = { doctorId: doctor.doctorId, amount: 125.5, description: 'دفعة مستحقات' };
  const report = {
    id: 42,
    ...doctor,
    type: 1,
    typeName: 'إيداع',
    amount: 125.5,
    appointmentId: 15,
    employeeName: 'سارة',
    description: 'مستحقات الكشف',
    createdAt: '2026-09-26T10:30:00',
  };

  function getRequests(): TestRequest[] {
    const pending = http.match(
      (request) => request.url.includes('/DoctorWallet/') && request.method === 'GET',
    );
    expect(pending).toHaveLength(2);
    return pending;
  }

  function flushReports(pending = getRequests(), total = 20): void {
    pending.forEach((request) =>
      request.flush({
        isSuccess: true,
        data: request.request.url.includes('transactions-report')
          ? { items: [report], totalCount: total, totalPages: 2 }
          : {
              ...doctor,
              periodDeposits: 800,
              periodWithdrawals: 200,
              periodNetBalance: 600,
              totalOverallBalance: total,
            },
      }),
    );
  }

  function element<T extends HTMLElement>(selector: string): T {
    const host: HTMLElement = fixture.nativeElement;
    const result = host.querySelector<T>(selector);
    if (!result) throw new Error('Missing element: ' + selector);
    return result;
  }

  beforeEach(() => {
    isAdmin.set(true);
    isAccountant.set(false);
    isDoctor.set(false);
    userId.set(doctor.doctorId);
    vi.clearAllMocks();
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {
        this.setAttribute('open', '');
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {
        this.removeAttribute('open');
      },
    });
    TestBed.configureTestingModule({
      imports: [DoctorWalletManagementPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: IdentityService,
          useValue: { isAdmin, isAccountant, isDoctor, userId, userName },
        },
        { provide: AppMessageService, useValue: messages },
      ],
    });
    fixture = TestBed.createComponent(DoctorWalletManagementPage);
    facade = fixture.componentInstance.facade;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function initialize(): Promise<void> {
    fixture.detectChanges();
    http
      .expectOne((request) => request.url.endsWith('/Doctors/all'))
      .flush({
        isSuccess: true,
        data: [{ userId: doctor.doctorId, fullName: doctor.doctorName, clinicName: 'الباطنة' }],
      });
    flushReports();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('renders summary values and transaction details from the two report endpoints', async () => {
    await initialize();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('800.00');
    expect(host.textContent).toContain('200.00');
    expect(host.textContent).toContain('600.00');
    expect(host.textContent).toContain('20.00');
    expect(element('tbody').textContent).toContain(doctor.doctorName);
    expect(element('tbody').textContent).toContain('125.50');
    expect(element('tbody').textContent).toContain('مستحقات الكشف');
  });

  it('allows accountants to load financial reports', async () => {
    isAdmin.set(false);
    isAccountant.set(true);
    await initialize();
    expect(facade.canManage()).toBe(true);
  });

  it('blocks reads, page content, and transactions for other roles', async () => {
    isAdmin.set(false);
    fixture.detectChanges();
    facade.refreshData();
    facade.openTransaction('deposit', doctor);
    await facade.submitTransaction(transaction);
    http.expectNone(() => true);
    expect(facade.actionTarget()).toBeNull();
    expect(element('[role="alert"]').textContent).toContain('تعذر عرض الحساب المالي');
  });

  it('protects the lazy route and exposes navigation to admin, accountant, and doctor', () => {
    const walletRoute = routes
      .find((route) => route.path === 'main')
      ?.children?.find((route) => route.path === 'doctor-wallet');
    expect(walletRoute?.canActivate?.length).toBeGreaterThan(0);
    expect(walletRoute?.data?.['roles']).toEqual([ROLES.Admin, ROLES.Accountant, ROLES.Doctor]);
    expect(walletRoute?.loadComponent).toBeDefined();
    for (const items of [ADMIN_NAV_ITEMS, ACCOUNTANT_NAV_ITEMS, DOCTOR_NAV_ITEMS])
      expect(items.some((item) => item.route === '/main/doctor-wallet')).toBe(true);
    for (const items of [RECEPTIONIST_NAV_ITEMS])
      expect(items.some((item) => item.route === '/main/doctor-wallet')).toBe(false);
  });

  it.each(['deposit', 'withdraw'] as const)(
    'submits %s for the selected row, prevents duplicate requests, and refreshes both reports',
    async (action) => {
      await initialize();
      facade.openTransaction(action, doctor);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(facade.actionTarget()).toMatchObject({ action, ...doctor });
      const pending = facade.submitTransaction(transaction);
      await facade.submitTransaction(transaction);
      facade.closeTransaction();
      expect(facade.actionTarget()).not.toBeNull();
      const request = http.expectOne((request) => request.url.endsWith('/DoctorWallet/' + action));
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(transaction);
      request.flush({ isSuccess: true, data: true });
      await pending;
      expect(facade.actionTarget()).toBeNull();
      expect(messages.addSuccessMessage).toHaveBeenCalledOnce();
      flushReports();
      await fixture.whenStable();
    },
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, 1.123])(
    'rejects invalid amount %s without sending a financial request',
    async (amount) => {
      facade.openTransaction('withdraw', doctor);
      await facade.submitTransaction({ ...transaction, amount });
      http.expectNone(() => true);
      expect(facade.actionError()).not.toBe('');
    },
  );

  it('rejects changing the row doctor or a blank description', async () => {
    facade.openTransaction('deposit', doctor);
    await facade.submitTransaction({ ...transaction, doctorId: 'another-doctor' });
    await facade.submitTransaction({ ...transaction, description: '  ' });
    http.expectNone(() => true);
    expect(facade.actionError()).not.toBe('');
  });

  it('retains the selected doctor and displays backend rejection without refreshing reports', async () => {
    facade.openTransaction('withdraw', doctor);
    const pending = facade.submitTransaction(transaction);
    http
      .expectOne((request) => request.url.endsWith('/withdraw'))
      .flush({ isSuccess: false, data: false, message: 'الرصيد غير كافٍ' });
    await pending;
    expect(facade.actionError()).toBe('الرصيد غير كافٍ');
    expect(facade.actionTarget()?.doctorId).toBe(doctor.doctorId);
    expect(facade.actionLoading()).toBe(false);
    expect(messages.addSuccessMessage).not.toHaveBeenCalled();
    http.expectNone(() => true);
  });

  it.each([
    ['2026-09-01', '2026-09-26'],
    ['2026-09-01', ''],
    ['', '2026-09-26'],
  ])('sends independent dates %s / %s and clears the preset', (fromDate, toDate) => {
    facade.setPeriodFilter(Period.Today);
    flushReports();
    facade.setDateRangeFilter(fromDate, toDate);
    const pending = getRequests();
    for (const request of pending) {
      const params = new URL(request.request.urlWithParams).searchParams;
      expect(params.has('Period')).toBe(false);
      expect(params.get('FromDate')).toBe(fromDate || null);
      expect(params.get('DateTo')).toBe(toDate || null);
    }
    flushReports(pending);
  });

  it('keeps report pagination independent from summary and resets the page on filter changes', async () => {
    await initialize();
    facade.setPage(2);
    const reportRequest = http.expectOne((request) => request.url.includes('transactions-report'));
    expect(new URL(reportRequest.request.urlWithParams).searchParams.get('PageNumber')).toBe('2');
    http.expectNone((request) => request.url.includes('summary-report'));
    flushReports([reportRequest]);
    facade.setDoctorFilter(doctor.doctorId);
    const pending = getRequests();
    for (const request of pending) {
      expect(new URL(request.request.urlWithParams).searchParams.get('DoctorId')).toBe(
        doctor.doctorId,
      );
      expect(new URL(request.request.urlWithParams).searchParams.get('PageNumber')).toBe('1');
    }
    flushReports(pending);
  });

  it('ignores stale responses after selecting a newer filter', async () => {
    facade.setPeriodFilter(Period.Today);
    const older = getRequests();
    facade.setPeriodFilter(Period.ThisMonth);
    flushReports(getRequests(), 7);
    await Promise.resolve();
    flushReports(older, 99);
    await Promise.resolve();
    expect(facade.totalCount()).toBe(7);
    expect(facade.summary()?.totalOverallBalance).toBe(7);
  });

  it('loads only the signed-in doctor account and hides management controls', async () => {
    isAdmin.set(false);
    isDoctor.set(true);
    fixture.detectChanges();
    http.expectNone((request) => request.url.includes('/Doctors/'));
    const pending = getRequests();
    for (const request of pending) {
      expect(new URL(request.request.urlWithParams).searchParams.get('DoctorId')).toBe(userId());
    }
    flushReports(pending);
    await fixture.whenStable();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(element('h1').textContent).toContain('حسابي المالي');
    expect(host.textContent).not.toContain('جميع الأطباء');
    expect(host.textContent).not.toContain('إضافة رصيد');
    expect(host.textContent).not.toContain('سحب رصيد');
    expect(host.querySelectorAll('app-wallet-filters select')).toHaveLength(1);
    expect(host.querySelectorAll('tbody button')).toHaveLength(0);
    expect(element('app-wallet-summary').textContent).toContain(userName());
    facade.openTransaction('deposit', doctor);
    facade.openTransaction('withdraw', doctor);
    await facade.submitTransaction(transaction);
    expect(facade.actionTarget()).toBeNull();
    http.expectNone(() => true);
  });

  it('keeps the current doctor ID after all filter changes, reset, and pagination', async () => {
    isAdmin.set(false);
    isDoctor.set(true);
    const checkRequests = () => {
      const pending = getRequests();
      for (const request of pending) {
        expect(new URL(request.request.urlWithParams).searchParams.get('DoctorId')).toBe(userId());
      }
      flushReports(pending);
    };
    facade.initialize();
    checkRequests();
    await Promise.resolve();
    facade.setDoctorFilter('another-doctor');
    http.expectNone(() => true);
    facade.doctorIdFilter.set('another-doctor');
    facade.setPeriodFilter(Period.Today);
    checkRequests();
    facade.setDateRangeFilter('2026-09-01', '2026-09-26');
    checkRequests();
    facade.resetFilters();
    checkRequests();
    facade.setPage(2);
    const page = http.expectOne((request) => request.url.includes('transactions-report'));
    expect(new URL(page.request.urlWithParams).searchParams.get('DoctorId')).toBe(userId());
    flushReports([page]);
    facade.setPageSize(25);
    const size = http.expectOne((request) => request.url.includes('transactions-report'));
    expect(new URL(size.request.urlWithParams).searchParams.get('DoctorId')).toBe(userId());
    flushReports([size]);
  });

  it('never sends unfiltered requests when the doctor user ID is missing', async () => {
    isAdmin.set(false);
    isDoctor.set(true);
    userId.set('');
    fixture.detectChanges();
    facade.refreshData();
    await facade.loadTransactions();
    await facade.loadSummary();
    await facade.loadDoctors();
    facade.resetFilters();
    facade.setDateRangeFilter('2026-09-01', '');
    facade.setPageSize(25);
    http.expectNone(() => true);
    expect(facade.canView()).toBe(false);
    expect(element('[role="alert"]').textContent).toContain('تعذر عرض الحساب المالي');
  });

  it('does not expose a deposit action in an empty doctor account', async () => {
    isAdmin.set(false);
    isDoctor.set(true);
    fixture.detectChanges();
    for (const request of getRequests()) {
      request.flush({
        isSuccess: true,
        data: request.request.url.includes('transactions-report')
          ? { items: [], totalCount: 0, totalPages: 0 }
          : null,
      });
    }
    await fixture.whenStable();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('لا توجد حركات مالية');
    expect(host.textContent).not.toContain('إضافة رصيد');
    expect(host.textContent).not.toContain('جميع الأطباء');
  });

  it('shows report and summary errors instead of presenting failures as zero balances', async () => {
    facade.refreshData();
    for (const request of getRequests())
      request.flush({ isSuccess: false, message: 'Unavailable' });
    await Promise.resolve();
    expect(facade.reportError()).not.toBe('');
    expect(facade.summaryError()).not.toBe('');
    expect(facade.summary()).toBeNull();
  });
});
