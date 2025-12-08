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
  ClientUseCasesImpl,
  ClientDocumentAlreadyExistsError,
  ClientNotFoundError,
} from '../use-case/ClientUseCasesImpl';
import type {
  CreateClientDTO,
  UpdateClientDTO,
  ClientResponseDTO,
} from '../interface/ClientDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';

interface ListClientsQueryHttp {
  page?: string;
  pageSize?: string;
  isActive?: string;
  documentNumber?: string;
  name?: string;
}

@Controller('v1/clients')
export class ClientsController {
  constructor(private readonly useCases: ClientUseCasesImpl) {}

  @Post()
  async create(@Body() body: CreateClientDTO): Promise<ClientResponseDTO> {
    try {
      return await this.useCases.createClient(body);
    } catch (error) {
      if (error instanceof ClientDocumentAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ClientResponseDTO> {
    const client = await this.useCases.getClientById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  @Get()
  async list(
    @Query() query: ListClientsQueryHttp,
  ): Promise<PaginatedResult<ClientResponseDTO>> {
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

    return this.useCases.listClients({
      page,
      pageSize,
      isActive,
      documentNumber: query.documentNumber,
      name: query.name,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateClientDTO,
  ): Promise<ClientResponseDTO> {
    try {
      const updated = await this.useCases.updateClient(id, body);
      if (!updated) {
        throw new NotFoundException('Client not found');
      }
      return updated;
    } catch (error) {
      if (error instanceof ClientDocumentAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.useCases.deleteClient(id);
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
