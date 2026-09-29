import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDays, faCheck, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { CreateSpecialOfferResponse } from '../../models/CreateSpecialOfferResponse';

@Component({
  selector: 'app-special-offer-details-view',
  imports: [DatePipe, DecimalPipe, RouterLink, FontAwesomeModule],
  templateUrl: './special-offer-details-view.html',
})
export class SpecialOfferDetailsViewComponent {
  readonly offer = input.required<CreateSpecialOfferResponse>();
  readonly appointments = computed(() => this.offer().appointments ?? []);
  readonly faCalendarDays = faCalendarDays;
  readonly faCheck = faCheck;
  readonly faUser = faUser;
  readonly faUsers = faUsers;
}
