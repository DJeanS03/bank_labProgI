import type { LoanStatus } from '../domain/Loan';

export interface CreateLoanDTO {
  clientId: string;
  principalAmount: number;
  interestRateMonthly: number;
  taxRate: number;
  months: number;
}

export interface UpdateLoanStatusDTO {
  status: LoanStatus;
}

export interface LoanResponseDTO {
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
  createdAt: string;
  updatedAt: string;
}
