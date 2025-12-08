export type MachineStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Machine {
  id: string;

  name: string;

  serialNumber?: string | null;

  brand?: string | null;

  model?: string | null;

  status: MachineStatus;

  clientId: string;

  createdAt: Date;
  updatedAt: Date;

  createdByAdminId?: string | null;
  updatedByAdminId?: string | null;
}
