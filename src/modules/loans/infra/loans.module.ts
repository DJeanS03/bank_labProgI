import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoanUseCasesImpl } from '../use-case/LoanUseCasesImpl';
import { InMemoryLoanRepository } from './InMemoryLoanRepository';
import { ClientsModule } from '../../clients/infra/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [LoansController],
  providers: [
    LoanUseCasesImpl,
    {
      provide: 'LoanRepository',
      useClass: InMemoryLoanRepository,
    },
  ],
  exports: [LoanUseCasesImpl],
})
export class LoansModule {}
