export type LoanStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'PAID'
  | 'CANCELLED';

export interface Loan {
  id: string;
  clientId: string;
  principalAmount: number;
  interestRateMonthly: number;
  taxRate: number;
  months: number;
  interestAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}
