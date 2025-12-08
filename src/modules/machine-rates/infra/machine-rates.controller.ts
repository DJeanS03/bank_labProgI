import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import {
  MachineRateUseCasesImpl,
  MachineRateAlreadyExistsError,
  MachineRateMachineNotFoundError,
  MachineRateNotFoundError,
} from '../use-case/MachineRateUseCasesImpl';
import type {
  CreateMachineRateDTO,
  MachineRateResponseDTO,
  UpdateMachineRateDTO,
} from '../interface/MachineRateDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';
import type { MachineRateListQuery } from '../use-case/MachineRateUseCases';
import type { TransactionType } from '../domain/MachineRate';

interface ListMachineRatesQueryHttp {
  page?: string;
  pageSize?: string;
  machineId?: string;
  cardBrand?: string;
  transactionType?: string;
  isActive?: string;
}

@Controller('v1/machine-rates')
export class MachineRatesController {
  constructor(private readonly useCases: MachineRateUseCasesImpl) {}

  @Post()
  async create(
    @Body() body: CreateMachineRateDTO,
  ): Promise<MachineRateResponseDTO> {
    try {
      return await this.useCases.createMachineRate(body);
    } catch (error) {
      if (error instanceof MachineRateAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof MachineRateMachineNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<MachineRateResponseDTO> {
    const rate = await this.useCases.getMachineRateById(id);
    if (!rate) {
      throw new NotFoundException('Machine rate not found');
    }
    return rate;
  }

  @Get()
  async list(
    @Query() query: ListMachineRatesQueryHttp,
  ): Promise<PaginatedResult<MachineRateResponseDTO>> {
    const page =
      typeof query.page === 'string' ? Number(query.page) : undefined;
    const pageSize =
      typeof query.pageSize === 'string' ? Number(query.pageSize) : undefined;

    let isActive: boolean | undefined;
    if (typeof query.isActive === 'string') {
      if (query.isActive.toLowerCase() === 'true') {
        isActive = true;
      } else if (query.isActive.toLowerCase() === 'false') {
        isActive = false;
      }
    }

    let transactionType: TransactionType | undefined;
    if (typeof query.transactionType === 'string') {
      if (
        query.transactionType === 'DEBIT' ||
        query.transactionType === 'CREDIT_FULL' ||
        query.transactionType === 'CREDIT_INSTALLMENTS'
      ) {
        transactionType = query.transactionType;
      }
    }

    const listQuery: MachineRateListQuery = {
      page,
      pageSize,
      machineId: query.machineId,
      cardBrand: query.cardBrand,
      transactionType,
    };

    if (typeof isActive === 'boolean') {
      listQuery.isActive = isActive;
    }

    return this.useCases.listMachineRates(listQuery);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMachineRateDTO,
  ): Promise<MachineRateResponseDTO> {
    try {
      const updated = await this.useCases.updateMachineRate(id, body);
      if (!updated) {
        throw new NotFoundException('Machine rate not found');
      }
      return updated;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.useCases.deleteMachineRate(id);
    } catch (error) {
      if (error instanceof MachineRateNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
