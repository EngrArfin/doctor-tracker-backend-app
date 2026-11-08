import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctor/entities/doctor.entity.js';
import { Patient } from '../patient/entities/patient.entity.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
