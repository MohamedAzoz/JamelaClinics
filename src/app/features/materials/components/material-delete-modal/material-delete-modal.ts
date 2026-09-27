import { Component, inject } from '@angular/core';
import { MaterialsFacade } from '../../services/materials.facade';
import { MaterialDialogComponent } from '../material-dialog/material-dialog';

@Component({
  selector: 'app-material-delete-modal',
  imports: [MaterialDialogComponent],
  template: `
    <app-material-dialog
      title="حذف المادة"
      [busy]="facade.actionLoading()"
      (closed)="facade.closeDelete()"
    >
      <p class="leading-7">
        هل تريد حذف المادة <strong class="break-words">{{ facade.materialToDelete()?.name }}</strong
        >؟
      </p>
      <p class="mt-2 text-sm text-text-muted">
        يمكنك تعطيل المادة بدلًا من حذفها إذا كنت تريد الاحتفاظ ببياناتها.
      </p>
      @if (facade.deleteError()) {
        <p role="alert" class="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
          {{ facade.deleteError() }}
        </p>
      }
      <footer class="mt-6 flex flex-wrap justify-end gap-3 border-t border-primary/10 pt-5">
        <button
          type="button"
          (click)="facade.closeDelete()"
          [disabled]="facade.actionLoading()"
          class="rounded-xl border border-primary/20 px-5 py-3 font-semibold disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          type="button"
          (click)="facade.deleteMaterial()"
          [disabled]="facade.actionLoading()"
          class="rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800 disabled:opacity-50"
        >
          {{ facade.actionLoading() ? 'جارٍ الحذف…' : 'تأكيد الحذف' }}
        </button>
      </footer>
    </app-material-dialog>
  `,
})
export class MaterialDeleteModalComponent {
  readonly facade = inject(MaterialsFacade);
}
