import { Component, computed, inject } from '@angular/core';
import { MaterialsFacade } from '../../services/materials.facade';

@Component({
  selector: 'app-materials-pagination',
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4 text-sm text-text">
      <p role="status">عرض {{ firstItem() }}–{{ lastItem() }} من {{ facade.totalCount() }}</p>
      <div class="flex items-center gap-2">
        <label for="materials-page-size">عدد الصفوف</label>
        <select
          id="materials-page-size"
          [value]="facade.pageSize()"
          (change)="changeSize($event)"
          [disabled]="facade.loading() || facade.actionLoading()"
          class="rounded-xl border border-primary/20 bg-surface p-2.5"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
      @if (facade.totalPages() > 1) {
        <nav aria-label="صفحات المواد" class="flex flex-wrap gap-1.5">
          <button
            type="button"
            (click)="facade.setPage(facade.pageNumber() - 1)"
            [disabled]="busy() || facade.pageNumber() === 1"
            class="rounded-lg border border-primary/20 bg-surface px-3 py-2.5 disabled:opacity-50"
          >
            السابق
          </button>
          @for (page of pages(); track page) {
            <button
              type="button"
              (click)="facade.setPage(page)"
              [disabled]="busy()"
              [attr.aria-label]="'الصفحة ' + page"
              [attr.aria-current]="page === facade.pageNumber() ? 'page' : null"
              class="min-w-10 rounded-lg border border-primary/20 px-3 py-2.5"
              [class]="
                page === facade.pageNumber() ? 'bg-primary text-white' : 'bg-surface text-text'
              "
            >
              {{ page }}
            </button>
          }
          <button
            type="button"
            (click)="facade.setPage(facade.pageNumber() + 1)"
            [disabled]="busy() || facade.pageNumber() === facade.totalPages()"
            class="rounded-lg border border-primary/20 bg-surface px-3 py-2.5 disabled:opacity-50"
          >
            التالي
          </button>
        </nav>
      }
    </div>
  `,
})
export class MaterialsPaginationComponent {
  readonly facade = inject(MaterialsFacade);
  readonly busy = computed(() => this.facade.loading() || this.facade.actionLoading());
  readonly firstItem = computed(() =>
    this.facade.totalCount() ? (this.facade.pageNumber() - 1) * this.facade.pageSize() + 1 : 0,
  );
  readonly lastItem = computed(() =>
    Math.min(this.facade.pageNumber() * this.facade.pageSize(), this.facade.totalCount()),
  );
  readonly pages = computed(() => {
    const start = Math.max(1, this.facade.pageNumber() - 2);
    const end = Math.min(this.facade.totalPages(), this.facade.pageNumber() + 2);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  });
  changeSize(event: Event): void {
    this.facade.setPageSize(Number((event.target as HTMLSelectElement).value));
  }
}
