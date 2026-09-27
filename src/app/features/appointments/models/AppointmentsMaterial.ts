import { MaterialItem } from './MaterialItem';

export interface AppointmentsMaterial {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: string;
  queueNumber: number;
  appointmentDate: string;
  status: string;
  consultationFee: number;
  discountAmount: number;
  finalPaidAmount: number;
  totalMaterialsCost: number;
  netAppointmentAmount: number;
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
  materials: MaterialItem[];
}
