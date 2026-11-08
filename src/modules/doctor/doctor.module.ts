import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService, TypeOrmModule],
})
export class DoctorModule {}
