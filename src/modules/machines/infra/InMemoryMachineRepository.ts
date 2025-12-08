import { Injectable } from '@nestjs/common';
import { Machine, MachineStatus } from '../domain/Machine';
import { MachineRepository } from '../domain/MachineRepository';
import { MachineListQuery } from '../use-case/MachineUseCases';

@Injectable()
export class InMemoryMachineRepository implements MachineRepository {
  private machines: Machine[] = [];

  async create(machine: Machine): Promise<Machine> {
    this.machines.push(machine);
    return machine;
  }

  async findById(id: string): Promise<Machine | null> {
    const machine = this.machines.find((m) => m.id === id);
    return machine ?? null;
  }

  async findAll(
    query: MachineListQuery,
  ): Promise<{ items: Machine[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    let result = this.machines.slice();

    if (query.clientId) {
      result = result.filter((m) => m.clientId === query.clientId);
    }

    if (query.status) {
      const status = query.status as MachineStatus;
      result = result.filter((m) => m.status === status);
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
  }

  async update(machine: Machine): Promise<Machine> {
    const index = this.machines.findIndex((m) => m.id === machine.id);
    if (index === -1) {
      this.machines.push(machine);
      return machine;
    }

    this.machines[index] = machine;
    return machine;
  }

  async delete(id: string): Promise<void> {
    this.machines = this.machines.filter((m) => m.id !== id);
  }
}
