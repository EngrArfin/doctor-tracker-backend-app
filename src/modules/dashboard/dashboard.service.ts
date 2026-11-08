import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../doctor/entities/doctor.entity.js';
import { Patient } from '../patient/entities/patient.entity.js';

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

  async getPatientsPerDoctor() {
    const doctors = await this.doctorRepository.find();
    const patients = await this.patientRepository.find();

    return doctors.map((doc) => {
      const assignedCount = patients.filter((p) => p.doctorId === doc.id).length;
      return {
        doctorName: doc.name.replace('Dr. ', ''),
        patientCount: doc.patientsCount + assignedCount,
        specialization: doc.specialization,
      };
    });
  }

  async getSpecializations() {
    const doctors = await this.doctorRepository.find();
    const counts: Record<string, number> = {};
    doctors.forEach((d) => {
      counts[d.specialization] = (counts[d.specialization] || 0) + 1;
    });

    const colors = [
      '#2563EB', '#0D9488', '#F59E0B', '#8B5CF6',
      '#EC4899', '#10B981', '#6366F1', '#14B8A6'
    ];

    const keys = Object.keys(counts);
    const total = doctors.length || 1;

    return keys.map((spec, idx) => ({
      name: spec,
      value: counts[spec],
      percentage: Number(((counts[spec] / total) * 100).toFixed(1)),
      color: colors[idx % colors.length],
    }));
  }

  async resetData() {
    await this.patientRepository.delete({});
    await this.doctorRepository.delete({});

    return {
      message: 'All records cleared. Baseline records will automatically reseed on next request.',
    };
  }
}
