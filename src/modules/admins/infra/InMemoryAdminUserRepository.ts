import { Injectable } from '@nestjs/common';
import { AdminUser } from '../domain/AdminUser';
import { AdminUserRepository } from '../domain/AdminUserRepository';
import { AdminUserListQuery } from '../use-case/AdminUserUseCases';

@Injectable()
export class InMemoryAdminUserRepository implements AdminUserRepository {
  private admins: AdminUser[] = [];

  async create(admin: AdminUser): Promise<AdminUser> {
    this.admins.push(admin);
    return admin;
  }

  async findById(id: string): Promise<AdminUser | null> {
    const admin = this.admins.find((a) => a.id === id);
    return admin ?? null;
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const normalized = email.toLowerCase();
    const admin = this.admins.find((a) => a.email.toLowerCase() === normalized);
    return admin ?? null;
  }

  async findAll(
    query: AdminUserListQuery,
  ): Promise<{ items: AdminUser[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    let result = this.admins.slice();

    if (typeof query.isActive === 'boolean') {
      result = result.filter((a) => a.isActive === query.isActive);
    }

    if (query.email && query.email.trim().length > 0) {
      const term = query.email.trim().toLowerCase();
      result = result.filter((a) => a.email.toLowerCase().includes(term));
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
  }

  async update(admin: AdminUser): Promise<AdminUser> {
    const index = this.admins.findIndex((a) => a.id === admin.id);
    if (index === -1) {
      this.admins.push(admin);
      return admin;
    }

    this.admins[index] = admin;
    return admin;
  }

  async delete(id: string): Promise<void> {
    this.admins = this.admins.filter((a) => a.id !== id);
  }
}
