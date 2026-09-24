import { Period } from './Period';

export interface FilterAppointment {
  Period?: Period;
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
}
export interface FilterAppointmentsForExcel {
  Period?: Period;
  FromDate?: string;
  ToDate?: string;
}
