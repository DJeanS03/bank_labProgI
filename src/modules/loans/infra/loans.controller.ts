import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import {
  LoanUseCasesImpl,
  LoanClientNotFoundOrInactiveError,
  LoanInvalidStatusTransitionError,
  LoanNotFoundError,
} from '../use-case/LoanUseCasesImpl';
import type {
  CreateLoanDTO,
  LoanResponseDTO,
  UpdateLoanStatusDTO,
} from '../interface/LoanDTOs';
import type { PaginatedResult } from '../../admins/use-case/AdminUserUseCases';
import type { LoanListQuery } from '../use-case/LoanUseCases';
import type { LoanStatus } from '../domain/Loan';

interface ListLoansQueryHttp {
  page?: string;
  pageSize?: string;
  clientId?: string;
  status?: string;
}

@Controller('v1/loans')
export class LoansController {
  constructor(private readonly useCases: LoanUseCasesImpl) {}

  @Post()
  async create(@Body() body: CreateLoanDTO): Promise<LoanResponseDTO> {
    try {
      return await this.useCases.createLoan(body);
    } catch (error) {
      if (error instanceof LoanClientNotFoundOrInactiveError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<LoanResponseDTO> {
    const loan = await this.useCases.getLoanById(id);
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }
    return loan;
  }

  @Get()
  async list(
    @Query() query: ListLoansQueryHttp,
  ): Promise<PaginatedResult<LoanResponseDTO>> {
    const page =
      typeof query.page === 'string' ? Number(query.page) : undefined;
    const pageSize =
      typeof query.pageSize === 'string' ? Number(query.pageSize) : undefined;

    let status: LoanStatus | undefined;
    if (typeof query.status === 'string') {
      const value = query.status;
      if (
        value === 'PENDING' ||
        value === 'APPROVED' ||
        value === 'REJECTED' ||
        value === 'ACTIVE' ||
        value === 'PAID' ||
        value === 'CANCELLED'
      ) {
        status = value;
      }
    }

    const listQuery: LoanListQuery = {
      page,
      pageSize,
      clientId: query.clientId,
      status,
    };

    return this.useCases.listLoans(listQuery);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateLoanStatusDTO,
  ): Promise<LoanResponseDTO> {
    try {
      const updated = await this.useCases.updateLoanStatus(id, body);
      if (!updated) {
        throw new NotFoundException('Loan not found');
      }
      return updated;
    } catch (error) {
      if (error instanceof LoanInvalidStatusTransitionError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.useCases.deleteLoan(id);
    } catch (error) {
      if (error instanceof LoanNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
