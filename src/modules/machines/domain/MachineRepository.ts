import { Machine } from './Machine';
import { MachineListQuery } from '../use-case/MachineUseCases';

export interface MachineRepository {
  create(machine: Machine): Promise<Machine>;

  findById(id: string): Promise<Machine | null>;

  findAll(
    query: MachineListQuery,
  ): Promise<{ items: Machine[]; total: number }>;

  update(machine: Machine): Promise<Machine>;

  delete(id: string): Promise<void>;
}
