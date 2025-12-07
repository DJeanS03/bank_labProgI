import { MachineStatus } from '../domain/Machine';

export interface CreateMachineDTO {
  name: string;
  clientId: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  status?: MachineStatus;
}

export interface UpdateMachineDTO {
  name?: string;
  serialNumber?: string | null;
  brand?: string | null;
  model?: string | null;
  status?: MachineStatus;
}

export interface MachineResponseDTO {
  id: string;
  name: string;
  clientId: string;
  serialNumber?: string | null;
  brand?: string | null;
  model?: string | null;
  status: MachineStatus;
  createdAt: string;
  updatedAt: string;
}
