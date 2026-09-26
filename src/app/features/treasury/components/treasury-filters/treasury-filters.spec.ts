import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMessageService } from '@core/services/app-message-service';
import { TreasuryFiltersComponent } from './treasury-filters';
import { TreasuryFacade } from '../../services/treasury.facade';
import { TreasuryPeriod, TreasuryType } from '../../models/ReportExpense';

describe('Treasury filtering', () => {
  let facade: TreasuryFacade;
  let http: HttpTestingController;
  let fixture: ComponentFixture<TreasuryFiltersComponent>;
  const messages = { addErrorMessage: vi.fn(), showHttpError: vi.fn() };

  function requests(): TestRequest[] {
    const pending = http.match((request) => request.url.includes('/Treasury/'));
    expect(pending).toHaveLength(2);
    return pending;
  }

  function flush(pending: TestRequest[], total = 30): void {
    for (const request of pending) {
      request.flush({
        isSuccess: true,
        data: request.request.url.includes('/report')
          ? { items: [], totalCount: total, totalPages: 3 }
          : {
              totalIncome: total,
              totalExpense: 0,
              netProfit: total,
              currentTreasuryBalance: total,
            },
      });
    }
  }

  function expectFilters(expected: Record<string, string>): void {
    const pending = requests();
    for (const request of pending) {
      const params = new URL(request.request.urlWithParams, 'http://localhost').searchParams;
      expect(Object.fromEntries(params)).toEqual({ PageNumber: '1', PageSize: '10', ...expected });
    }
    flush(pending);
  }

  function element<T extends HTMLElement>(selector: string): T {
    const host: HTMLElement = fixture.nativeElement;
    const result = host.querySelector<T>(selector);
    if (!result) throw new Error(`Missing element: ${selector}`);
    return result;
  }

  function select(selector: string, value: number | ''): void {
    const control = element<HTMLSelectElement>(selector);
    control.value = String(value);
    control.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  }

  function inputDate(index: number, value: string): void {
    const host: HTMLElement = fixture.nativeElement;
    const input = host.querySelectorAll<HTMLInputElement>('input[type="date"]')[index];
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  function applyDates(): void {
    element<HTMLFormElement>('form').dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [TreasuryFiltersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppMessageService, useValue: messages },
      ],
    });
    facade = TestBed.inject(TreasuryFacade);
    http = TestBed.inject(HttpTestingController);
    facade.initialize();
    flush(requests());
    await Promise.resolve();
    fixture = TestBed.createComponent(TreasuryFiltersComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it.each([
    ['2026-09-01', '2026-09-26'],
    ['2026-09-01', ''],
    ['', '2026-09-26'],
    ['2026-09-26', '2026-09-26'],
  ])('applies dates %s / %s to report and summary without a preset', (fromDate, toDate) => {
    select('select', TreasuryPeriod.Today);
    expectFilters({ Period: '1' });
    inputDate(0, fromDate);
    inputDate(1, toDate);
    http.expectNone((request) => request.url.includes('/Treasury/'));
    applyDates();
    expectFilters({
      ...(fromDate ? { FromDate: fromDate } : {}),
      ...(toDate ? { ToDate: toDate } : {}),
    });
    expect(element<HTMLSelectElement>('select').value).toBe('');
  });

  it('applies type immediately while preserving applied dates and pending date edits', () => {
    facade.setDateRangeFilter('2026-09-01', '2026-09-20');
    expectFilters({ FromDate: '2026-09-01', ToDate: '2026-09-20' });
    fixture.detectChanges();
    inputDate(1, '2026-09-26');
    select('#treasury-type', TreasuryType.Expense);
    expectFilters({ Type: '2', FromDate: '2026-09-01', ToDate: '2026-09-20' });
    expect(fixture.componentInstance.dateRange().toDate).toBe('2026-09-26');
  });

  it('clears applied and draft dates when selecting a preset, preserving type', () => {
    facade.setTypeFilter(TreasuryType.Income);
    expectFilters({ Type: '1' });
    facade.setDateRangeFilter('2026-09-01', '2026-09-20');
    expectFilters({ Type: '1', FromDate: '2026-09-01', ToDate: '2026-09-20' });
    fixture.detectChanges();
    select('select', TreasuryPeriod.ThisMonth);
    expectFilters({ Type: '1', Period: '2' });
    expect(fixture.componentInstance.dateRange()).toEqual({ fromDate: '', toDate: '' });
  });

  it('rejects reversed dates without sending requests', () => {
    inputDate(0, '2026-09-26');
    inputDate(1, '2026-09-01');
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(true);
    expect(element('[role="alert"]').textContent).toContain('تاريخ البداية');
    applyDates();
    facade.setDateRangeFilter('2026-09-26', '2026-09-01');
    expect(messages.addErrorMessage).toHaveBeenCalledOnce();
    http.expectNone((request) => request.url.includes('/Treasury/'));
  });

  it('preserves filters during pagination and resets the page when filters change', async () => {
    facade.setDateRangeFilter('2026-09-01', '');
    expectFilters({ FromDate: '2026-09-01' });
    const pageLoad = facade.setPage(2);
    const report = http.expectOne((request) => request.url.includes('/report'));
    expect(
      new URL(report.request.urlWithParams, 'http://localhost').searchParams.get('FromDate'),
    ).toBe('2026-09-01');
    expect(
      new URL(report.request.urlWithParams, 'http://localhost').searchParams.get('PageNumber'),
    ).toBe('2');
    http.expectNone((request) => request.url.includes('/summary'));
    flush([report]);
    await pageLoad;
    facade.setTypeFilter(TreasuryType.Expense);
    expectFilters({ Type: '2', FromDate: '2026-09-01' });
  });

  it('resets filters and draft dates while retaining page size', async () => {
    const resize = facade.setPageSize(25);
    flush([http.expectOne((request) => request.url.includes('/report'))]);
    await resize;
    facade.setDateRangeFilter('2026-09-01', '');
    expectFilters({ FromDate: '2026-09-01', PageSize: '25' });
    fixture.detectChanges();
    inputDate(1, '2026-09-26');
    element<HTMLButtonElement>('button[type="button"]').click();
    fixture.detectChanges();
    expectFilters({ PageSize: '25' });
    expect(fixture.componentInstance.dateRange()).toEqual({ fromDate: '', toDate: '' });
  });

  it('does not replace current results with a late response for an older filter', async () => {
    facade.setPeriodFilter(TreasuryPeriod.Today);
    const older = requests();
    facade.setDateRangeFilter('2026-09-01', '2026-09-26');
    flush(requests(), 7);
    await Promise.resolve();
    flush(older, 99);
    await Promise.resolve();
    expect(facade.totalCount()).toBe(7);
    expect(facade.summary()?.totalIncome).toBe(7);
    expect(facade.loading()).toBe(false);
  });
});
