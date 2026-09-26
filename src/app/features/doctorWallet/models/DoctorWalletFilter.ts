import { AppointmentStatus } from './AppointmentStatus';
import { Period } from './Period';
/**Name	Description
DoctorId

Period

FromDate

ToDate
Type

PageNumber
PageSize

 */
export interface DoctorWalletFilter {
  DoctorId?: string;
  Period?: Period | null;
  FromDate?: string;
  DateTo?: string;
  Type?: AppointmentStatus | null;
  PageNumber?: number;
  PageSize?: number;
}
