export interface DoctorWalletReport {
  id: number;
  doctorName: string;
  doctorId: string;
  type: number;
  typeName: string;
  amount: number;
  appointmentId: number;
  employeeName: string;
  description: string;
  createdAt: Date;
}
export enum TreasuryType {
  Income = 1, // الايرادات
  Expense = 2, // المصروفات
}
