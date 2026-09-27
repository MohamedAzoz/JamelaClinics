import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { MaterialsFacade } from '../../services/materials.facade';

@Component({
  selector: 'app-materials-table',
  imports: [DecimalPipe, FontAwesomeModule],
  templateUrl: './materials-table.html',
})
export class MaterialsTableComponent {
  readonly facade = inject(MaterialsFacade);
  readonly icons = { edit: faPen, delete: faTrash, power: faPowerOff };
}
