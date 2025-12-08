import type {
  PaginationQuery,
  PaginatedResult,
} from '../../admins/use-case/AdminUserUseCases';
import type { LoanStatus } from '../domain/Loan';
import type {
  CreateLoanDTO,
  LoanResponseDTO,
  UpdateLoanStatusDTO,
} from '../interface/LoanDTOs';

export interface LoanListQuery extends PaginationQuery {
  clientId?: string;
  status?: LoanStatus;
}

export interface LoanUseCases {
  createLoan(data: CreateLoanDTO): Promise<LoanResponseDTO>;

  getLoanById(id: string): Promise<LoanResponseDTO | null>;

  listLoans(query: LoanListQuery): Promise<PaginatedResult<LoanResponseDTO>>;

  updateLoanStatus(
    id: string,
    data: UpdateLoanStatusDTO,
  ): Promise<LoanResponseDTO | null>;

  deleteLoan(id: string): Promise<void>;
}
