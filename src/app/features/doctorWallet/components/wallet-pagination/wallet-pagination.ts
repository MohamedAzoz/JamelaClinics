import { Component, computed, inject } from '@angular/core';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';

@Component({
  selector: 'app-wallet-pagination',
  templateUrl: './wallet-pagination.html',
})
export class WalletPaginationComponent {
  readonly facade = inject(DoctorWalletFacade);
  readonly pages = computed(() => {
    const start = Math.max(1, this.facade.pageNumber() - 2);
    const end = Math.min(this.facade.totalPages(), this.facade.pageNumber() + 2);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  });
  readonly firstItem = computed(() =>
    this.facade.totalCount() ? (this.facade.pageNumber() - 1) * this.facade.pageSize() + 1 : 0,
  );
  readonly lastItem = computed(() =>
    Math.min(this.facade.pageNumber() * this.facade.pageSize(), this.facade.totalCount()),
  );

  changeSize(event: Event): void {
    this.facade.setPageSize(Number((event.target as HTMLSelectElement).value));
  }
}
