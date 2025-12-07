import {
  BadRequestException,
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
  MachineUseCasesImpl,
  MachineNotFoundError,
} from '../use-case/MachineUseCasesImpl';
import type {
  CreateMachineDTO,
  MachineResponseDTO,
  UpdateMachineDTO,
} from '../interface/MachineDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';

interface ListMachinesQueryHttp {
  page?: string;
  pageSize?: string;
  clientId?: string;
  status?: string;
}

@Controller('v1/machines')
export class MachinesController {
  constructor(private readonly useCases: MachineUseCasesImpl) {}

  @Post()
  async create(@Body() body: CreateMachineDTO): Promise<MachineResponseDTO> {
    try {
      return await this.useCases.createMachine(body);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<MachineResponseDTO> {
    const machine = await this.useCases.getMachineById(id);
    if (!machine) {
      throw new NotFoundException('Machine not found');
    }
    return machine;
  }

  @Get()
  async list(
    @Query() query: ListMachinesQueryHttp,
  ): Promise<PaginatedResult<MachineResponseDTO>> {
    const page =
      typeof query.page === 'string' ? Number(query.page) : undefined;
    const pageSize =
      typeof query.pageSize === 'string' ? Number(query.pageSize) : undefined;

    return this.useCases.listMachines({
      page,
      pageSize,
      clientId: query.clientId,
      status: query.status,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMachineDTO,
  ): Promise<MachineResponseDTO> {
    try {
      const updated = await this.useCases.updateMachine(id, body);
      if (!updated) {
        throw new NotFoundException('Machine not found');
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
      await this.useCases.deleteMachine(id);
    } catch (error) {
      if (error instanceof MachineNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
