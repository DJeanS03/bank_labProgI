import { Client } from './Client';
import { ClientListQuery } from '../use-case/ClientUseCases';

export interface ClientRepository {
  create(client: Client): Promise<Client>;

  findById(id: string): Promise<Client | null>;

  findByDocumentNumber(documentNumber: string): Promise<Client | null>;

  findAll(query: ClientListQuery): Promise<{ items: Client[]; total: number }>;

  update(client: Client): Promise<Client>;

  delete(id: string): Promise<void>;
}
