import { Injectable } from '@nestjs/common';
import type { Loan } from '../domain/Loan';
import type { LoanRepository } from '../domain/LoanRepository';
import type { LoanListQuery } from '../use-case/LoanUseCases';

@Injectable()
export class InMemoryLoanRepository implements LoanRepository {
  private loans: Loan[] = [];

  async create(loan: Loan): Promise<Loan> {
    this.loans.push(loan);
    return loan;
  }

  async findById(id: string): Promise<Loan | null> {
    const loan = this.loans.find((l) => l.id === id);
    return loan ?? null;
  }

  async findAll(
    query: LoanListQuery,
  ): Promise<{ items: Loan[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    let result = this.loans.slice();

    if (query.clientId) {
      result = result.filter((l) => l.clientId === query.clientId);
    }

    if (query.status) {
      result = result.filter((l) => l.status === query.status);
    }

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
  }

  async update(loan: Loan): Promise<Loan> {
    const index = this.loans.findIndex((l) => l.id === loan.id);
    if (index === -1) {
      this.loans.push(loan);
      return loan;
    }

    this.loans[index] = loan;
    return loan;
  }

  async delete(id: string): Promise<void> {
    this.loans = this.loans.filter((l) => l.id !== id);
  }
}
