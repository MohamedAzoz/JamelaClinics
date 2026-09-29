import { SpecialOfferAppointment } from './SpecialOfferAppointment';

export interface CreateSpecialOfferResponse {
  id: number;
  title: string;
  description: string;
  offerPrice: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  appointments?: SpecialOfferAppointment[];
}
