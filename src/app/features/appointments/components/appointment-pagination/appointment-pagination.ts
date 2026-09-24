import { Component, inject, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';

@Component({
  selector: 'app-appointment-pagination',
  imports: [FontAwesomeModule],
  templateUrl: './appointment-pagination.html',
})
export class AppointmentPaginationComponent {
  readonly facade = inject(AppointmentFacade);

  readonly faChevronRight = faChevronRight;
  readonly faChevronLeft = faChevronLeft;

  readonly pagesList = computed(() => {
    const total = this.facade.totalPages();
    const current = this.facade.pageNumber();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  onPageSelect(page: number): void {
    this.facade.setPageNumber(page);
  }

  onPageSizeChange(event: Event): void {
    const val = Number((event.target as HTMLSelectElement).value);
    this.facade.setPageSize(val);
  }
}
