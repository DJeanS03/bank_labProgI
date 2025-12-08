import { AdminUser } from './AdminUser';
import { AdminUserListQuery } from '../use-case/AdminUserUseCases';

export interface AdminUserRepository {
  create(admin: AdminUser): Promise<AdminUser>;

  findById(id: string): Promise<AdminUser | null>;

  findByEmail(email: string): Promise<AdminUser | null>;

  findAll(
    query: AdminUserListQuery,
  ): Promise<{ items: AdminUser[]; total: number }>;

  update(admin: AdminUser): Promise<AdminUser>;

  delete(id: string): Promise<void>;
}
