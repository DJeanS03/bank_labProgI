import { AdminRole } from '../domain/AdminUser';

export interface CreateAdminUserDTO {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface UpdateAdminUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface AdminUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}
