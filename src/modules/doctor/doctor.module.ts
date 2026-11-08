import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity.js';
import { Patient } from '../patient/entities/patient.entity.js';
import { DoctorService } from './doctor.service.js';
import { DoctorController } from './doctor.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService, TypeOrmModule],
})
export class DoctorModule {}
