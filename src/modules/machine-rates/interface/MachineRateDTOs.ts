import type { TransactionType } from '../domain/MachineRate';

export interface CreateMachineRateDTO {
  machineId: string;
  cardBrand: string;
  transactionType: TransactionType;
  feePercentage: number;
  payoutDays: number;
  isActive?: boolean;
}

export interface UpdateMachineRateDTO {
  cardBrand?: string;
  transactionType?: TransactionType;
  feePercentage?: number;
  payoutDays?: number;
  isActive?: boolean;
}

export interface MachineRateResponseDTO {
  id: string;
  machineId: string;
  cardBrand: string;
  transactionType: TransactionType;
  feePercentage: number;
  payoutDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
