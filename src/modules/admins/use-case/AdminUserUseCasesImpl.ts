import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AdminRole, AdminUser } from '../domain/AdminUser';
import type { AdminUserRepository } from '../domain/AdminUserRepository';
import type {
  AdminUserListQuery,
  AdminUserUseCases,
  PaginatedResult,
} from './AdminUserUseCases';
import type {
  AdminUserResponseDTO,
  CreateAdminUserDTO,
  UpdateAdminUserDTO,
} from '../interface/AdminUserDTOs';

export class AdminEmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email already in use: ${email}`);
    this.name = 'AdminEmailAlreadyExistsError';
  }
}

export class AdminNotFoundError extends Error {
  constructor(id: string) {
    super(`Admin not found: ${id}`);
    this.name = 'AdminNotFoundError';
  }
}

@Injectable()
export class AdminUserUseCasesImpl implements AdminUserUseCases {
  constructor(
    @Inject('AdminUserRepository')
    private readonly adminRepo: AdminUserRepository,
  ) {}

  async createAdminUser(
    data: CreateAdminUserDTO,
  ): Promise<AdminUserResponseDTO> {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!name) {
      throw new Error('Name is required');
    }

    if (name.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 6) {
      throw new Error('Password must have at least 6 characters');
    }

    const existing = await this.adminRepo.findByEmail(email);
    if (existing) {
      throw new AdminEmailAlreadyExistsError(email);
    }

    const now = new Date();
    const role: AdminRole = data.role ?? 'ADMIN';
    const isActive = data.isActive ?? true;

    const admin: AdminUser = {
      id: randomUUID(),
      name,
      email,
      passwordHash: this.hashPassword(password),
      role,
      isActive,
      createdAt: now,
      updatedAt: now,
      createdByAdminId: null,
      updatedByAdminId: null,
      lastLoginAt: null,
      loginFailedAttempts: 0,
      lockedUntil: null,
    };

    const created = await this.adminRepo.create(admin);
    return this.toResponseDTO(created);
  }

  async getAdminUserById(id: string): Promise<AdminUserResponseDTO | null> {
    const admin = await this.adminRepo.findById(id);
    if (!admin) {
      return null;
    }

    return this.toResponseDTO(admin);
  }

  async listAdminUsers(
    query: AdminUserListQuery,
  ): Promise<PaginatedResult<AdminUserResponseDTO>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { items, total } = await this.adminRepo.findAll({
      ...query,
      page,
      pageSize,
    });

    const mapped = items.map((admin) => this.toResponseDTO(admin));

    return {
      items: mapped,
      total,
      page,
      pageSize,
    };
  }

  async updateAdminUser(
    id: string,
    data: UpdateAdminUserDTO,
  ): Promise<AdminUserResponseDTO | null> {
    const admin = await this.adminRepo.findById(id);
    if (!admin) {
      return null;
    }

    if (typeof data.name === 'string') {
      const trimmed = data.name.trim();
      if (trimmed.length > 0) {
        if (trimmed.length < 3) {
          throw new Error('Name must have at least 3 characters');
        }
        admin.name = trimmed;
      }
    }

    if (typeof data.email === 'string') {
      const trimmedEmail = data.email.trim().toLowerCase();
      if (trimmedEmail.length > 0 && trimmedEmail !== admin.email) {
        if (!this.isValidEmail(trimmedEmail)) {
          throw new Error('Invalid email format');
        }
        const existing = await this.adminRepo.findByEmail(trimmedEmail);
        if (existing && existing.id !== admin.id) {
          throw new AdminEmailAlreadyExistsError(trimmedEmail);
        }
        admin.email = trimmedEmail;
      }
    }

    if (typeof data.role !== 'undefined') {
      admin.role = data.role;
    }

    if (typeof data.isActive === 'boolean') {
      admin.isActive = data.isActive;
    }

    if (typeof data.password === 'string' && data.password.length > 0) {
      if (data.password.length < 6) {
        throw new Error('Password must have at least 6 characters');
      }
      admin.passwordHash = this.hashPassword(data.password);
    }

    admin.updatedAt = new Date();

    const updated = await this.adminRepo.update(admin);
    return this.toResponseDTO(updated);
  }

  async deleteAdminUser(id: string): Promise<void> {
    const admin = await this.adminRepo.findById(id);
    if (!admin) {
      throw new AdminNotFoundError(id);
    }

    await this.adminRepo.delete(id);
  }

  private hashPassword(password: string): string {
    return `hashed:${password}`;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private toResponseDTO(admin: AdminUser): AdminUserResponseDTO {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
      lastLoginAt: admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null,
    };
  }
}
