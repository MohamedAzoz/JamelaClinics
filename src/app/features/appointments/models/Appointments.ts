import { AppointmentStatus } from './AppointmentStatus';
import { VisitType } from './VisitType';

export interface Appointments {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: VisitType;
  queueNumber: number;
  appointmentDate: Date;
  createdAt: Date;
  doctorScheduleId: number;
  doctorName: string;
  employeeName: string;
  status: AppointmentStatus;
  consultationFee: number;
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
  isPaid: boolean;
}
