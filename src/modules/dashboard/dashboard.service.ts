import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from '../doctor/schemas/doctor.schema';
import { Patient, PatientDocument } from '../patient/schemas/patient.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async getStats() {
    const totalDoctors = await this.doctorModel.countDocuments();
    const totalPatients = await this.patientModel.countDocuments();
    const activeDoctors = await this.doctorModel.countDocuments({ status: 'Active' });
    const criticalPatients = await this.patientModel.countDocuments({ status: 'Critical' });

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

