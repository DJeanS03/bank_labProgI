import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachineUseCasesImpl } from '../use-case/MachineUseCasesImpl';
import { InMemoryMachineRepository } from './InMemoryMachineRepository';

@Module({
  controllers: [MachinesController],
  providers: [
    MachineUseCasesImpl,
    {
      provide: 'MachineRepository',
      useClass: InMemoryMachineRepository,
    },
  ],
  exports: [MachineUseCasesImpl],
})
export class MachinesModule {}
