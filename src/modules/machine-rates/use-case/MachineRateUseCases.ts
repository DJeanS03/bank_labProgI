import type {
  PaginationQuery,
  PaginatedResult,
} from '../../admins/use-case/AdminUserUseCases';
import type { TransactionType } from '../domain/MachineRate';
import type {
  MachineRateResponseDTO,
  CreateMachineRateDTO,
  UpdateMachineRateDTO,
} from '../interface/MachineRateDTOs';

export interface MachineRateListQuery extends PaginationQuery {
  machineId?: string;
  cardBrand?: string;
  transactionType?: TransactionType;
  isActive?: boolean;
}

export interface MachineRateUseCases {
  createMachineRate(
    data: CreateMachineRateDTO,
  ): Promise<MachineRateResponseDTO>;

  getMachineRateById(id: string): Promise<MachineRateResponseDTO | null>;

  listMachineRates(
    query: MachineRateListQuery,
  ): Promise<PaginatedResult<MachineRateResponseDTO>>;

  updateMachineRate(
    id: string,
    data: UpdateMachineRateDTO,
  ): Promise<MachineRateResponseDTO | null>;

  deleteMachineRate(id: string): Promise<void>;
}
