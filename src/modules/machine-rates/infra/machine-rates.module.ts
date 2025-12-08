import { Module } from '@nestjs/common';
import { MachineRatesController } from './machine-rates.controller';
import { MachineRateUseCasesImpl } from '../use-case/MachineRateUseCasesImpl';
import { InMemoryMachineRateRepository } from './InMemoryMachineRateRepository';
import { MachinesModule } from '../../machines/infra/machines.module';

@Module({
  imports: [MachinesModule],
  controllers: [MachineRatesController],
  providers: [
    MachineRateUseCasesImpl,
    {
      provide: 'MachineRateRepository',
      useClass: InMemoryMachineRateRepository,
    },
  ],
  exports: [MachineRateUseCasesImpl],
})
export class MachineRatesModule {}
