import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';
import { ReportExpense, TreasuryPeriod, TreasuryType } from '../../models/ReportExpense';

interface FilterModel {
  type: string;
  period: string;
  fromDate: string;
  toDate: string;
  pageSize: string;
}

@Component({
  selector: 'app-treasury-filters',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './treasury-filters.html',
})
export class TreasuryFiltersComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faFilter = faFilter;
  readonly faRotateLeft = faRotateLeft;
  readonly model = signal<FilterModel>(this.toModel(this.facade.filters()));
  readonly filterForm = form(this.model);

  TreasuryPeriod = TreasuryPeriod;
  TreasuryType = TreasuryType;

  apply(): void {
    const value = this.model();
    const current = this.facade.filters();
    const filters: ReportExpense = {
      type: value.type ? (Number(value.type) as TreasuryType) : undefined,
      period: value.period ? (Number(value.period) as TreasuryPeriod) : undefined,
      fromDate: value.fromDate || undefined,
      toDate: value.toDate || undefined,
      pageNumber: 1,
      pageSize: Number(value.pageSize),
    };
    this.facade.setFilters({ ...current, ...filters });
  }

  reset(): void {
    const defaults = this.facade.filters();
    this.model.set(this.toModel(defaults));
    this.facade.setFilters(defaults);
  }

  private toModel(filters: ReportExpense): FilterModel {
    return {
      type: filters.type?.toString() ?? '',
      period: filters.period?.toString() ?? '',
      fromDate: filters.fromDate ?? '',
      toDate: filters.toDate ?? '',
      pageSize: filters.pageSize?.toString() ?? '10',
    };
  }

}
