import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminsModule } from './modules/admins/infra/admins.module';
import { ClientsModule } from './modules/clients/infra/clients.module';
import { MachinesModule } from './modules/machines/infra/machines.module';
import { MachineRatesModule } from './modules/machine-rates/infra/machine-rates.module';
import { LoansModule } from './modules/loans/infra/loans.module';

@Module({
  imports: [
    AdminsModule,
    ClientsModule,
    MachinesModule,
    MachineRatesModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
