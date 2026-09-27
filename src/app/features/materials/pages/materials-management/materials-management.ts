import { Component, inject, OnInit } from '@angular/core';
import { MaterialsFacade } from '../../services/materials.facade';
import { MaterialsHeaderComponent } from '../../components/materials-header/materials-header';
import { MaterialsFiltersComponent } from '../../components/materials-filters/materials-filters';
import { MaterialsTableComponent } from '../../components/materials-table/materials-table';
import { MaterialsPaginationComponent } from '../../components/materials-pagination/materials-pagination';
import { MaterialFormModalComponent } from '../../components/material-form-modal/material-form-modal';
import { MaterialDeleteModalComponent } from '../../components/material-delete-modal/material-delete-modal';

@Component({
  selector: 'app-materials-management',
  imports: [
    MaterialsHeaderComponent,
    MaterialsFiltersComponent,
    MaterialsTableComponent,
    MaterialsPaginationComponent,
    MaterialFormModalComponent,
    MaterialDeleteModalComponent,
  ],
  providers: [MaterialsFacade],
  template: `
    <div dir="rtl" class="min-h-full p-4 sm:p-6 lg:p-8">
      @if (facade.canManage()) {
        <div class="mx-auto flex max-w-7xl flex-col gap-6">
          <app-materials-header />
          <app-materials-filters />
          <app-materials-table />
          <app-materials-pagination />
        </div>
        @if (facade.editor()) {
          <app-material-form-modal />
        }
        @if (facade.materialToDelete()) {
          <app-material-delete-modal />
        }
      } @else {
        <p role="alert" class="rounded-2xl bg-surface p-6 text-text">
          هذه الصفحة متاحة للأدمن فقط.
        </p>
      }
    </div>
  `,
})
export class MaterialsManagementPage implements OnInit {
  readonly facade = inject(MaterialsFacade);
  ngOnInit(): void {
    this.facade.initialize();
  }
}
