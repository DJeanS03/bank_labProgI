import { Injectable } from '@nestjs/common';
import type { MachineRate } from '../domain/MachineRate';
import type { MachineRateRepository } from '../domain/MachineRateRepository';
import type { MachineRateListQuery } from '../use-case/MachineRateUseCases';

@Injectable()
export class InMemoryMachineRateRepository implements MachineRateRepository {
  private rates: MachineRate[] = [];

  async create(rate: MachineRate): Promise<MachineRate> {
    this.rates.push(rate);
    return rate;
  }

  async findById(id: string): Promise<MachineRate | null> {
    const rate = this.rates.find((r) => r.id === id);
    return rate ?? null;
  }

  async findAll(
    query: MachineRateListQuery,
  ): Promise<{ items: MachineRate[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    let result = this.rates.slice();

    if (query.machineId) {
      result = result.filter((r) => r.machineId === query.machineId);
    }

    if (query.cardBrand) {
      const brand = query.cardBrand.toUpperCase();
      result = result.filter((r) => r.cardBrand.toUpperCase() === brand);
    }

    if (query.transactionType) {
      result = result.filter(
        (r) => r.transactionType === query.transactionType,
      );
    }

    if (typeof query.isActive === 'boolean') {
      result = result.filter((r) => r.isActive === query.isActive);
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
  }

  async update(rate: MachineRate): Promise<MachineRate> {
    const index = this.rates.findIndex((r) => r.id === rate.id);
    if (index === -1) {
      this.rates.push(rate);
      return rate;
    }

    this.rates[index] = rate;
    return rate;
  }

  async delete(id: string): Promise<void> {
    this.rates = this.rates.filter((r) => r.id !== id);
  }
}
