import {
  AdminUserResponseDTO,
  CreateAdminUserDTO,
  UpdateAdminUserDTO,
} from '../interface/AdminUserDTOs';

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface AdminUserListQuery extends PaginationQuery {
  isActive?: boolean;
  email?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUserUseCases {
  createAdminUser(data: CreateAdminUserDTO): Promise<AdminUserResponseDTO>;

  getAdminUserById(id: string): Promise<AdminUserResponseDTO | null>;

  listAdminUsers(
    query: AdminUserListQuery,
  ): Promise<PaginatedResult<AdminUserResponseDTO>>;

  updateAdminUser(
    id: string,
    data: UpdateAdminUserDTO,
  ): Promise<AdminUserResponseDTO | null>;

  deleteAdminUser(id: string): Promise<void>;
}
