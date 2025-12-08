export type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;

  passwordHash: string;

  role: AdminRole;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  createdByAdminId?: string | null;

  updatedByAdminId?: string | null;

  lastLoginAt?: Date | null;

  loginFailedAttempts: number;

  lockedUntil?: Date | null;
}
