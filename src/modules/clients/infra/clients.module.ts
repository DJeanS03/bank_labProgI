import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientUseCasesImpl } from '../use-case/ClientUseCasesImpl';
import { InMemoryClientRepository } from './InMemoryClientRepository';

@Module({
  controllers: [ClientsController],
  providers: [
    ClientUseCasesImpl,
    {
      provide: 'ClientRepository',
      useClass: InMemoryClientRepository,
    },
  ],
  exports: [ClientUseCasesImpl, 'ClientRepository'],
})
export class ClientsModule {}
