import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Loan, LoanStatus } from '../domain/Loan';
import type { LoanRepository } from '../domain/LoanRepository';
import type { LoanUseCases, LoanListQuery } from './LoanUseCases';
import type {
  CreateLoanDTO,
  LoanResponseDTO,
  UpdateLoanStatusDTO,
} from '../interface/LoanDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';
import type { ClientRepository } from '../../clients/domain/ClientRepository';

export class LoanClientNotFoundOrInactiveError extends Error {
  constructor(clientId: string) {
    super(`Client not found or inactive: ${clientId}`);
    this.name = 'LoanClientNotFoundOrInactiveError';
  }
}

export class LoanNotFoundError extends Error {
  constructor(id: string) {
    super(`Loan not found: ${id}`);
    this.name = 'LoanNotFoundError';
  }
}

export class LoanInvalidStatusTransitionError extends Error {
  constructor(from: LoanStatus, to: LoanStatus) {
    super(`Invalid loan status transition from ${from} to ${to}`);
    this.name = 'LoanInvalidStatusTransitionError';
  }
}

@Injectable()
export class LoanUseCasesImpl implements LoanUseCases {
  constructor(
    @Inject('LoanRepository')
    private readonly loanRepo: LoanRepository,
    @Inject('ClientRepository')
    private readonly clientRepo: ClientRepository,
  ) {}

  async createLoan(data: CreateLoanDTO): Promise<LoanResponseDTO> {
    const clientId = data.clientId?.trim();
    const principalAmount = data.principalAmount;
    const interestRateMonthly = data.interestRateMonthly;
    const taxRate = data.taxRate;
    const months = data.months;

    if (!clientId) {
      throw new Error('clientId is required');
    }

    if (
      typeof principalAmount !== 'number' ||
      Number.isNaN(principalAmount) ||
      principalAmount <= 0
    ) {
      throw new Error('principalAmount must be a number greater than 0');
    }

    if (
      typeof interestRateMonthly !== 'number' ||
      Number.isNaN(interestRateMonthly) ||
      interestRateMonthly < 0
    ) {
      throw new Error('interestRateMonthly must be a number >= 0');
    }

    if (typeof taxRate !== 'number' || Number.isNaN(taxRate) || taxRate < 0) {
      throw new Error('taxRate must be a number >= 0');
    }

    if (typeof months !== 'number' || Number.isNaN(months) || months < 1) {
      throw new Error('months must be a number >= 1');
    }

    const client = await this.clientRepo.findById(clientId);
    if (!client || !client.isActive) {
      throw new LoanClientNotFoundOrInactiveError(clientId);
    }

    const interestAmount =
      principalAmount * (interestRateMonthly / 100) * months;
    const taxAmount = principalAmount * (taxRate / 100);
    const totalAmount = principalAmount + interestAmount + taxAmount;

    const now = new Date();

    const loan: Loan = {
      id: randomUUID(),
      clientId,
      principalAmount,
      interestRateMonthly,
      taxRate,
      months,
      interestAmount,
      taxAmount,
      totalAmount,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.loanRepo.create(loan);
    return this.toResponseDTO(created);
  }

  async getLoanById(id: string): Promise<LoanResponseDTO | null> {
    const loan = await this.loanRepo.findById(id);
    if (!loan) {
      return null;
    }
    return this.toResponseDTO(loan);
  }

  async listLoans(
    query: LoanListQuery,
  ): Promise<PaginatedResult<LoanResponseDTO>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { items, total } = await this.loanRepo.findAll({
      ...query,
      page,
      pageSize,
    });

    const mapped = items.map((loan) => this.toResponseDTO(loan));

    return {
      items: mapped,
      total,
      page,
      pageSize,
    };
  }

  async updateLoanStatus(
    id: string,
    data: UpdateLoanStatusDTO,
  ): Promise<LoanResponseDTO | null> {
    const loan = await this.loanRepo.findById(id);
    if (!loan) {
      return null;
    }

    const newStatus = data.status;

    if (!this.isValidStatusTransition(loan.status, newStatus)) {
      throw new LoanInvalidStatusTransitionError(loan.status, newStatus);
    }

    loan.status = newStatus;
    loan.updatedAt = new Date();

    const updated = await this.loanRepo.update(loan);
    return this.toResponseDTO(updated);
  }

  async deleteLoan(id: string): Promise<void> {
    const loan = await this.loanRepo.findById(id);
    if (!loan) {
      throw new LoanNotFoundError(id);
    }
    await this.loanRepo.delete(id);
  }

  private isValidStatusTransition(from: LoanStatus, to: LoanStatus): boolean {
    if (from === to) {
      return true;
    }

    const allowed: Record<LoanStatus, LoanStatus[]> = {
      PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['ACTIVE', 'CANCELLED'],
      ACTIVE: ['PAID', 'CANCELLED'],
      REJECTED: [],
      PAID: [],
      CANCELLED: [],
    };

    return allowed[from].includes(to);
  }

  private toResponseDTO(loan: Loan): LoanResponseDTO {
    return {
      id: loan.id,
      clientId: loan.clientId,
      principalAmount: loan.principalAmount,
      interestRateMonthly: loan.interestRateMonthly,
      taxRate: loan.taxRate,
      months: loan.months,
      interestAmount: loan.interestAmount,
      taxAmount: loan.taxAmount,
      totalAmount: loan.totalAmount,
      status: loan.status,
      createdAt: loan.createdAt.toISOString(),
      updatedAt: loan.updatedAt.toISOString(),
    };
  }
}
