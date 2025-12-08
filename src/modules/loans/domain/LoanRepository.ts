import type { Loan } from './Loan';
import type { LoanListQuery } from '../use-case/LoanUseCases';

export interface LoanRepository {
  create(loan: Loan): Promise<Loan>;

  findById(id: string): Promise<Loan | null>;

  findAll(query: LoanListQuery): Promise<{ items: Loan[]; total: number }>;

  update(loan: Loan): Promise<Loan>;

  delete(id: string): Promise<void>;
}
