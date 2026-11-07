import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async getStats() {
    const totalDoctors = await this.doctorRepository.count();
    const totalPatients = await this.patientRepository.count();
    const activeDoctors = await this.doctorRepository.count({ where: { status: 'Active' } });
    const criticalPatients = await this.patientRepository.count({ where: { status: 'Critical' } });

    const averagePatientsPerDoctor = totalDoctors > 0 ? Math.round((totalPatients / totalDoctors) * 10) / 10 : 0;

    return {
      totalDoctors,
      totalPatients,
      activeDoctors,
      criticalPatients,
      averagePatientsPerDoctor,
      newPatientsThisMonth: totalPatients,
      doctorsGrowthPct: 12.5,
      patientsGrowthPct: 18.2,
      newPatientsGrowthPct: 8.4,
      avgRatioGrowthPct: 5.1,
    };
  }

  async getTrends() {
    return [
      { month: 'Sep', patients: 28, admissions: 14 },
      { month: 'Oct', patients: 35, admissions: 19 },
      { month: 'Nov', patients: 42, admissions: 22 },
      { month: 'Dec', patients: 38, admissions: 18 },
      { month: 'Jan', patients: 45, admissions: 25 },
      { month: 'Feb', patients: 52, admissions: 30 },
    ];
  }
}
