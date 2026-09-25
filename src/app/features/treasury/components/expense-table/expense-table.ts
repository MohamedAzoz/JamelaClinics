import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faFileInvoiceDollar,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Expense } from '../../models/Expense';
import { TreasuryFacade } from '../../services/treasury.facade';
import { TreasuryType } from '@features/treasury/models/ReportExpense';

@Component({
  selector: 'app-expense-table',
  imports: [FontAwesomeModule],
  templateUrl: './expense-table.html',
})
export class ExpenseTableComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faFileInvoiceDollar = faFileInvoiceDollar;
  readonly faCalendar = faCalendar;
  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;

  formatType(value: TreasuryType): string {
    switch (value) {
      case TreasuryType.Expense:
        return 'مصروفات';
      case TreasuryType.Income:
        return 'ايرادات';
      default:
        return '';
    }
  }

  formatMoney(value: number): string {
    return `${value} ج.م`;
  }
  formatDate(value: string): string {
    return new Date(value).toLocaleDateString('ar-EG');
  }
  edit(expense: Expense): void {
    this.facade.openEditModal(expense);
  }
  remove(expense: Expense): void {
    this.facade.openDeleteModal(expense);
  }
}
