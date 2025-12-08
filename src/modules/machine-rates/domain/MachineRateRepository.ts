import type { MachineRate } from './MachineRate';
import type { MachineRateListQuery } from '../use-case/MachineRateUseCases';

export interface MachineRateRepository {
  create(rate: MachineRate): Promise<MachineRate>;

  findById(id: string): Promise<MachineRate | null>;

  findAll(
    query: MachineRateListQuery,
  ): Promise<{ items: MachineRate[]; total: number }>;

  update(rate: MachineRate): Promise<MachineRate>;

  delete(id: string): Promise<void>;
}
