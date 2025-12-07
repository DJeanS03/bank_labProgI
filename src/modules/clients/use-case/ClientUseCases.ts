import {
  ClientResponseDTO,
  CreateClientDTO,
  UpdateClientDTO,
} from '../interface/ClientDTOs';
import {
  PaginationQuery,
  PaginatedResult,
} from '../../admins/use-case/AdminUserUseCases';

export interface ClientListQuery extends PaginationQuery {
  isActive?: boolean;
  documentNumber?: string;
  name?: string;
}

export interface ClientUseCases {
  createClient(data: CreateClientDTO): Promise<ClientResponseDTO>;

  getClientById(id: string): Promise<ClientResponseDTO | null>;

  listClients(
    query: ClientListQuery,
  ): Promise<PaginatedResult<ClientResponseDTO>>;

  updateClient(
    id: string,
    data: UpdateClientDTO,
  ): Promise<ClientResponseDTO | null>;

  deleteClient(id: string): Promise<void>;
}
