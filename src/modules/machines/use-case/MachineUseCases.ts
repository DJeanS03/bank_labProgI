import {
  MachineResponseDTO,
  CreateMachineDTO,
  UpdateMachineDTO,
} from '../interface/MachineDTOs';
import {
  PaginationQuery,
  PaginatedResult,
} from '../../admins/use-case/AdminUserUseCases';

export interface MachineListQuery extends PaginationQuery {
  clientId?: string;
  status?: string;
}

export interface MachineUseCases {
  createMachine(data: CreateMachineDTO): Promise<MachineResponseDTO>;

  getMachineById(id: string): Promise<MachineResponseDTO | null>;

  listMachines(
    query: MachineListQuery,
  ): Promise<PaginatedResult<MachineResponseDTO>>;

  updateMachine(
    id: string,
    data: UpdateMachineDTO,
  ): Promise<MachineResponseDTO | null>;

  deleteMachine(id: string): Promise<void>;
}
