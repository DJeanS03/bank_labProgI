import { Module } from '@nestjs/common';
import { AdminUserController } from './admins.controller';
import { AdminUserUseCasesImpl } from '../use-case/AdminUserUseCasesImpl';
import { InMemoryAdminUserRepository } from './InMemoryAdminUserRepository';

@Module({
  controllers: [AdminUserController],
  providers: [
    AdminUserUseCasesImpl,
    {
      provide: 'AdminUserRepository',
      useClass: InMemoryAdminUserRepository,
    },
  ],
  exports: [AdminUserUseCasesImpl],
})
export class AdminsModule {}
