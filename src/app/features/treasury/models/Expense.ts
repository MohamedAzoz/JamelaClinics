import { TreasuryType } from './ReportExpense';

export interface Expense {
  id: number;
  type: TreasuryType;
  typeName: string;
  amount: number;
  description: string;
  appointmentId: number;
  userName: string;
  createdAt: string;
}
