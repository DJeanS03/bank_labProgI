import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Machine, MachineStatus } from '../domain/Machine';
import type { MachineRepository } from '../domain/MachineRepository';
import type { MachineUseCases, MachineListQuery } from './MachineUseCases';
import type {
  CreateMachineDTO,
  MachineResponseDTO,
  UpdateMachineDTO,
} from '../interface/MachineDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';

export class MachineNotFoundError extends Error {
  constructor(id: string) {
    super(`Machine not found: ${id}`);
    this.name = 'MachineNotFoundError';
  }
}

@Injectable()
export class MachineUseCasesImpl implements MachineUseCases {
  constructor(
    @Inject('MachineRepository')
    private readonly machineRepo: MachineRepository,
  ) {}

  async createMachine(data: CreateMachineDTO): Promise<MachineResponseDTO> {
    const name = data.name?.trim();
    const clientId = data.clientId?.trim();

    if (!name) {
      throw new Error('Name is required');
    }

    if (!clientId) {
      throw new Error('clientId is required');
    }

    const now = new Date();
    const status: MachineStatus = data.status ?? 'ACTIVE';

    const machine: Machine = {
      id: randomUUID(),
      name,
      clientId,
      serialNumber: data.serialNumber ?? null,
      brand: data.brand ?? null,
      model: data.model ?? null,
      status,
      createdAt: now,
      updatedAt: now,
      createdByAdminId: null,
      updatedByAdminId: null,
    };

    const created = await this.machineRepo.create(machine);
    return this.toResponseDTO(created);
  }

  async getMachineById(id: string): Promise<MachineResponseDTO | null> {
    const machine = await this.machineRepo.findById(id);
    if (!machine) {
      return null;
    }
    return this.toResponseDTO(machine);
  }

  async listMachines(
    query: MachineListQuery,
  ): Promise<PaginatedResult<MachineResponseDTO>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { items, total } = await this.machineRepo.findAll({
      ...query,
      page,
      pageSize,
    });

    const mapped = items.map((machine) => this.toResponseDTO(machine));

    return {
      items: mapped,
      total,
      page,
      pageSize,
    };
  }

  async updateMachine(
    id: string,
    data: UpdateMachineDTO,
  ): Promise<MachineResponseDTO | null> {
    const machine = await this.machineRepo.findById(id);
    if (!machine) {
      return null;
    }

    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (trimmed.length > 0) {
        machine.name = trimmed;
      }
    }

    if ('serialNumber' in data) {
      machine.serialNumber = data.serialNumber ?? null;
    }

    if ('brand' in data) {
      machine.brand = data.brand ?? null;
    }

    if ('model' in data) {
      machine.model = data.model ?? null;
    }

    if (typeof data.status === 'string') {
      machine.status = data.status;
    }

    machine.updatedAt = new Date();

    const updated = await this.machineRepo.update(machine);
    return this.toResponseDTO(updated);
  }

  async deleteMachine(id: string): Promise<void> {
    const machine = await this.machineRepo.findById(id);
    if (!machine) {
      throw new MachineNotFoundError(id);
    }
    await this.machineRepo.delete(id);
  }

  private toResponseDTO(machine: Machine): MachineResponseDTO {
    return {
      id: machine.id,
      name: machine.name,
      clientId: machine.clientId,
      serialNumber: machine.serialNumber ?? null,
      brand: machine.brand ?? null,
      model: machine.model ?? null,
      status: machine.status,
      createdAt: machine.createdAt.toISOString(),
      updatedAt: machine.updatedAt.toISOString(),
    };
  }
}
