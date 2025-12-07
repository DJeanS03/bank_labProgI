import { Injectable } from '@nestjs/common';
import { Client } from '../domain/Client';
import { ClientRepository } from '../domain/ClientRepository';
import { ClientListQuery } from '../use-case/ClientUseCases';

@Injectable()
export class InMemoryClientRepository implements ClientRepository {
  private clients: Client[] = [];

  async create(client: Client): Promise<Client> {
    this.clients.push(client);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.id === id);
    return client ?? null;
  }

  async findByDocumentNumber(documentNumber: string): Promise<Client | null> {
    const normalized = documentNumber.trim();
    const client = this.clients.find((c) => c.documentNumber === normalized);
    return client ?? null;
  }

  async findAll(
    query: ClientListQuery,
  ): Promise<{ items: Client[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    let result = this.clients.slice();

    if (typeof query.isActive === 'boolean') {
      result = result.filter((c) => c.isActive === query.isActive);
    }

    if (query.documentNumber && query.documentNumber.trim().length > 0) {
      const normalized = query.documentNumber.trim();
      result = result.filter((c) => c.documentNumber === normalized);
    }

    if (query.name && query.name.trim().length > 0) {
      const term = query.name.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
  }

  async update(client: Client): Promise<Client> {
    const index = this.clients.findIndex((c) => c.id === client.id);
    if (index === -1) {
      this.clients.push(client);
      return client;
    }

    this.clients[index] = client;
    return client;
  }

  async delete(id: string): Promise<void> {
    this.clients = this.clients.filter((c) => c.id !== id);
  }
}
