import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSpinner,
  faTrashCan,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';
@Component({
  selector: 'app-expense-delete-modal',
  imports: [FontAwesomeModule],
  templateUrl: './expense-delete-modal.html',
})
export class ExpenseDeleteModalComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faSpinner = faSpinner;
  readonly faTrashCan = faTrashCan;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly faXmark = faXmark;
  confirm(): void {
    const expense = this.facade.expenseToDelete();
    if (expense && confirm(`هل تريد حذف المصروف "${expense.description}"؟`))
      this.facade.deleteExpense(expense.id);
  }
}
