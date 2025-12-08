import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Client, ClientAddress } from '../domain/Client';
import type { ClientRepository } from '../domain/ClientRepository';
import type { ClientUseCases, ClientListQuery } from './ClientUseCases';
import type {
  ClientResponseDTO,
  CreateClientDTO,
  UpdateClientDTO,
  ClientAddressDTO,
} from '../interface/ClientDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';

export class ClientDocumentAlreadyExistsError extends Error {
  constructor(documentNumber: string) {
    super(`Client document already in use: ${documentNumber}`);
    this.name = 'ClientDocumentAlreadyExistsError';
  }
}

export class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client not found: ${id}`);
    this.name = 'ClientNotFoundError';
  }
}

@Injectable()
export class ClientUseCasesImpl implements ClientUseCases {
  constructor(
    @Inject('ClientRepository')
    private readonly clientRepo: ClientRepository,
  ) {}

  async createClient(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const name = data.name?.trim();
    const documentNumber = data.documentNumber?.trim();
    const documentType = data.documentType;

    if (!name) {
      throw new Error('Name is required');
    }

    if (!documentNumber) {
      throw new Error('Document number is required');
    }

    if (!documentType) {
      throw new Error('Document type is required');
    }

    const existing = await this.clientRepo.findByDocumentNumber(documentNumber);
    if (existing) {
      throw new ClientDocumentAlreadyExistsError(documentNumber);
    }

    const now = new Date();
    const isActive = data.isActive ?? true;

    const address = this.mapAddressDTOToDomain(data.address);

    let birthDate: Date | null = null;
    if (typeof data.birthDate === 'string' && data.birthDate.length > 0) {
      birthDate = new Date(data.birthDate);
    }

    const client: Client = {
      id: randomUUID(),
      name,
      documentNumber,
      documentType,
      email: data.email?.trim() ?? null,
      phone: data.phone?.trim() ?? null,
      address,
      isActive,
      createdAt: now,
      updatedAt: now,
      createdByAdminId: null,
      updatedByAdminId: null,
      birthDate,
    };

    const created = await this.clientRepo.create(client);
    return this.toResponseDTO(created);
  }

  async getClientById(id: string): Promise<ClientResponseDTO | null> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      return null;
    }
    return this.toResponseDTO(client);
  }

  async listClients(
    query: ClientListQuery,
  ): Promise<PaginatedResult<ClientResponseDTO>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { items, total } = await this.clientRepo.findAll({
      ...query,
      page,
      pageSize,
    });

    const mapped = items.map((client) => this.toResponseDTO(client));

    return {
      items: mapped,
      total,
      page,
      pageSize,
    };
  }

  async updateClient(
    id: string,
    data: UpdateClientDTO,
  ): Promise<ClientResponseDTO | null> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      return null;
    }

    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (trimmed.length > 0) {
        client.name = trimmed;
      }
    }

    if (typeof data.email === 'string') {
      const trimmed = data.email.trim();
      client.email = trimmed.length > 0 ? trimmed : null;
    }

    if (typeof data.phone === 'string') {
      const trimmed = data.phone.trim();
      client.phone = trimmed.length > 0 ? trimmed : null;
    }

    if ('address' in data) {
      if (data.address) {
        client.address = this.mapAddressDTOToDomain(data.address);
      } else {
        client.address = null;
      }
    }

    if ('birthDate' in data) {
      if (typeof data.birthDate === 'string' && data.birthDate.length > 0) {
        client.birthDate = new Date(data.birthDate);
      } else {
        client.birthDate = null;
      }
    }

    if (typeof data.isActive === 'boolean') {
      client.isActive = data.isActive;
    }

    client.updatedAt = new Date();

    const updated = await this.clientRepo.update(client);
    return this.toResponseDTO(updated);
  }

  async deleteClient(id: string): Promise<void> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    await this.clientRepo.delete(id);
  }

  private mapAddressDTOToDomain(dto?: ClientAddressDTO): ClientAddress | null {
    if (!dto) {
      return null;
    }

    return {
      street: dto.street,
      number: dto.number,
      complement: dto.complement ?? null,
      neighborhood: dto.neighborhood ?? null,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
    };
  }

  private toResponseDTO(client: Client): ClientResponseDTO {
    const address = client.address
      ? {
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement ?? null,
          neighborhood: client.address.neighborhood ?? null,
          city: client.address.city,
          state: client.address.state,
          postalCode: client.address.postalCode,
        }
      : null;

    return {
      id: client.id,
      name: client.name,
      documentNumber: client.documentNumber,
      documentType: client.documentType,
      email: client.email ?? null,
      phone: client.phone ?? null,
      address,
      isActive: client.isActive,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      birthDate: client.birthDate ? client.birthDate.toISOString() : null,
    };
  }
}
