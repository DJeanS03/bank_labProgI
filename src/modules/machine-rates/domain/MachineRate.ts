export type TransactionType = 'DEBIT' | 'CREDIT_FULL' | 'CREDIT_INSTALLMENTS';

export interface MachineRate {
  id: string;
  machineId: string;
  cardBrand: string;
  transactionType: TransactionType;
  feePercentage: number;
  payoutDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByAdminId?: string | null;
  updatedByAdminId?: string | null;
}
