import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faReceipt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';

@Component({
  selector: 'app-wallet-table',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule],
  templateUrl: './wallet-table.html',
})
export class WalletTableComponent {
  readonly facade = inject(DoctorWalletFacade);
  readonly faReceipt = faReceipt;
  readonly faSpinner = faSpinner;
}
