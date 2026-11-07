import { Module } from '@nestjs/common';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [DoctorModule, PatientModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

