import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faReceipt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { WalletTransactionType } from '@features/doctorWallet/models/WalletTransactionType';

@Component({
  selector: 'app-wallet-table',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule],
  templateUrl: './wallet-table.html',
})
export class WalletTableComponent {
  [x: string]: any;
  readonly facade = inject(DoctorWalletFacade);
  readonly faReceipt = faReceipt;
  readonly faSpinner = faSpinner;

  WalletTransactionType = WalletTransactionType;

  formatType(type: WalletTransactionType): string {
    switch (type) {
      case WalletTransactionType.Deposit:
        return 'إيداع';
      case WalletTransactionType.Withdrawal:
        return 'سحب';
      default:
        return '';
    }
  }
  formatTypeClass(type: WalletTransactionType): string {
    switch (type) {
      case WalletTransactionType.Deposit:
        return 'bg-success/10 text-success';
      case WalletTransactionType.Withdrawal:
        return 'bg-danger/10 text-danger';
      default:
        return '';
    }
  }
}
