import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { MachineRate, TransactionType } from '../domain/MachineRate';
import type { MachineRateRepository } from '../domain/MachineRateRepository';
import type { MachineRepository } from '../../machines/domain/MachineRepository';
import type {
  MachineRateListQuery,
  MachineRateUseCases,
} from './MachineRateUseCases';
import type {
  MachineRateResponseDTO,
  CreateMachineRateDTO,
  UpdateMachineRateDTO,
} from '../interface/MachineRateDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';

export class MachineRateAlreadyExistsError extends Error {
  constructor(
    machineId: string,
    cardBrand: string,
    transactionType: TransactionType,
  ) {
    super(
      `Rate already exists for machine ${machineId} (${cardBrand}, ${transactionType})`,
    );
    this.name = 'MachineRateAlreadyExistsError';
  }
}

export class MachineRateNotFoundError extends Error {
  constructor(id: string) {
    super(`Machine rate not found: ${id}`);
    this.name = 'MachineRateNotFoundError';
  }
}

export class MachineRateMachineNotFoundError extends Error {
  constructor(machineId: string) {
    super(`Machine not found for machine rate: ${machineId}`);
    this.name = 'MachineRateMachineNotFoundError';
  }
}

@Injectable()
export class MachineRateUseCasesImpl implements MachineRateUseCases {
  constructor(
    @Inject('MachineRateRepository')
    private readonly rateRepo: MachineRateRepository,
    @Inject('MachineRepository')
    private readonly machineRepo: MachineRepository,
  ) {}

  async createMachineRate(
    data: CreateMachineRateDTO,
  ): Promise<MachineRateResponseDTO> {
    const machineId = data.machineId?.trim();
    const cardBrand = data.cardBrand?.trim();
    const transactionType = data.transactionType;
    const feePercentage = data.feePercentage;
    const payoutDays = data.payoutDays;

    if (!machineId) {
      throw new Error('machineId is required');
    }

    if (!cardBrand) {
      throw new Error('cardBrand is required');
    }

    if (!transactionType) {
      throw new Error('transactionType is required');
    }

    if (typeof feePercentage !== 'number' || Number.isNaN(feePercentage)) {
      throw new Error('feePercentage must be a number');
    }

    if (feePercentage <= 0 || feePercentage > 100) {
      throw new Error('feePercentage must be greater than 0 and at most 100');
    }

    if (typeof payoutDays !== 'number' || Number.isNaN(payoutDays)) {
      throw new Error('payoutDays must be a number');
    }

    if (payoutDays < 0) {
      throw new Error('payoutDays must be greater or equal to 0');
    }

    const machine = await this.machineRepo.findById(machineId);
    if (!machine) {
      throw new MachineRateMachineNotFoundError(machineId);
    }

    const existing = await this.rateRepo.findAll({
      machineId,
      cardBrand,
      transactionType,
      isActive: true,
      page: 1,
      pageSize: 1,
    });

    if (existing.total > 0) {
      throw new MachineRateAlreadyExistsError(
        machineId,
        cardBrand,
        transactionType,
      );
    }

    const now = new Date();
    const isActive = data.isActive ?? true;

    const rate: MachineRate = {
      id: randomUUID(),
      machineId,
      cardBrand,
      transactionType,
      feePercentage,
      payoutDays,
      isActive,
      createdAt: now,
      updatedAt: now,
      createdByAdminId: null,
      updatedByAdminId: null,
    };

    const created = await this.rateRepo.create(rate);
    return this.toResponseDTO(created);
  }

  async getMachineRateById(id: string): Promise<MachineRateResponseDTO | null> {
    const rate = await this.rateRepo.findById(id);
    if (!rate) {
      return null;
    }
    return this.toResponseDTO(rate);
  }

  async listMachineRates(
    query: MachineRateListQuery,
  ): Promise<PaginatedResult<MachineRateResponseDTO>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { items, total } = await this.rateRepo.findAll({
      ...query,
      page,
      pageSize,
    });

    const mapped = items.map((rate) => this.toResponseDTO(rate));

    return {
      items: mapped,
      total,
      page,
      pageSize,
    };
  }

  async updateMachineRate(
    id: string,
    data: UpdateMachineRateDTO,
  ): Promise<MachineRateResponseDTO | null> {
    const rate = await this.rateRepo.findById(id);
    if (!rate) {
      return null;
    }

    if (typeof data.cardBrand === 'string') {
      const trimmed = data.cardBrand.trim();
      if (trimmed.length > 0) {
        rate.cardBrand = trimmed;
      }
    }

    if (typeof data.transactionType === 'string') {
      rate.transactionType = data.transactionType;
    }

    if (typeof data.feePercentage === 'number') {
      if (data.feePercentage <= 0 || data.feePercentage > 100) {
        throw new Error('feePercentage must be greater than 0 and at most 100');
      }
      rate.feePercentage = data.feePercentage;
    }

    if (typeof data.payoutDays === 'number') {
      if (data.payoutDays < 0) {
        throw new Error('payoutDays must be greater or equal to 0');
      }
      rate.payoutDays = data.payoutDays;
    }

    if (typeof data.isActive === 'boolean') {
      rate.isActive = data.isActive;
    }

    rate.updatedAt = new Date();

    const updated = await this.rateRepo.update(rate);
    return this.toResponseDTO(updated);
  }

  async deleteMachineRate(id: string): Promise<void> {
    const rate = await this.rateRepo.findById(id);
    if (!rate) {
      throw new MachineRateNotFoundError(id);
    }
    await this.rateRepo.delete(id);
  }

  private toResponseDTO(rate: MachineRate): MachineRateResponseDTO {
    return {
      id: rate.id,
      machineId: rate.machineId,
      cardBrand: rate.cardBrand,
      transactionType: rate.transactionType,
      feePercentage: rate.feePercentage,
      payoutDays: rate.payoutDays,
      isActive: rate.isActive,
      createdAt: rate.createdAt.toISOString(),
      updatedAt: rate.updatedAt.toISOString(),
    };
  }
}
