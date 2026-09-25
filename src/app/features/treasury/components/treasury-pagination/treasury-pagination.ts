import { Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TreasuryFacade } from '../../services/treasury.facade';

@Component({
  selector: 'app-treasury-pagination',
  imports: [FontAwesomeModule],
  templateUrl: './treasury-pagination.html',
})
export class TreasuryPaginationComponent {
  readonly facade = inject(TreasuryFacade);
  readonly faChevronRight = faChevronRight;
  readonly faChevronLeft = faChevronLeft;

  readonly pagesList = computed(() => {
    const total = this.facade.totalPages();
    const current = this.facade.filters().pageNumber ?? 1;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  });

  onPageSelect(page: number): void {
    this.facade.setPage(page);
  }

  onPageSizeChange(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    if (pageSize > 0) this.facade.setPageSize(pageSize);
  }
}
