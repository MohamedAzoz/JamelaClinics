import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPen, faPowerOff, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CreateSpecialOfferResponse } from '../../models/CreateSpecialOfferResponse';
import { SpecialOffersFacade } from '../../services/special-offers.facade';

@Component({
  selector: 'app-special-offers-list',
  imports: [DatePipe, DecimalPipe, FontAwesomeModule],
  templateUrl: './special-offers-list.html',
})
export class SpecialOffersListComponent {
  readonly facade = inject(SpecialOffersFacade);
  private readonly router = inject(Router);
  readonly faEye = faEye;
  readonly faPen = faPen;
  readonly faPowerOff = faPowerOff;
  readonly faSpinner = faSpinner;
  readonly faTrash = faTrash;

  openDetails(offer: CreateSpecialOfferResponse): void {
    void this.router.navigate(['/main/special-offers', offer.id]);
  }
}
