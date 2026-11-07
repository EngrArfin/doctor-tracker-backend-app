import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService implements OnModuleInit {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async onModuleInit() {
    await this.seedInitialPatients();
  }

  private async seedInitialPatients() {
    try {
      const count = await this.patientRepository.count();
      if (count === 0) {
        const seedData = [
          {
            name: 'Robert Chen',
            email: 'robert.chen@gmail.com',
            phone: '+1 (555) 789-0123',
            age: 58,
            gender: 'Male',
            condition: 'Hypertension',
            status: 'Active' as const,
            doctorId: 'doc-1',
            doctorName: 'Dr. Sarah Jenkins',
            registeredDate: '2023-08-10',
            lastVisitDate: '2024-02-14',
            bloodGroup: 'A+',
            emergencyContact: '+1 (555) 789-0124 (Wife - Susan)',
            notes: 'Responding well to ACE inhibitor therapy. BP stabilized at 128/82.',
          },
          {
            name: 'Maria Rodriguez',
            email: 'maria.r@yahoo.com',
            phone: '+1 (555) 890-1234',
            age: 42,
            gender: 'Female',
            condition: 'Coronary Artery Disease',
            status: 'Under Observation' as const,
            doctorId: 'doc-1',
            doctorName: 'Dr. Sarah Jenkins',
            registeredDate: '2023-09-22',
            lastVisitDate: '2024-02-18',
            bloodGroup: 'O+',
            emergencyContact: '+1 (555) 890-1235 (Brother - Carlos)',
            notes: 'Post-angioplasty review scheduled. Exercise treadmill test ordered.',
          },
          {
            name: 'James Wilson',
            email: 'j.wilson@outlook.com',
            phone: '+1 (555) 901-2345',
            age: 35,
            gender: 'Male',
            condition: 'Migraine with Aura',
            status: 'Active' as const,
            doctorId: 'doc-2',
            doctorName: 'Dr. Marcus Vance',
            registeredDate: '2023-10-05',
            lastVisitDate: '2024-02-10',
            bloodGroup: 'B+',
            emergencyContact: '+1 (555) 901-2346 (Mother - Patricia)',
            notes: 'CGRP antagonist started. Headache frequency reduced by 60%.',
          },
        ];
        const patients = this.patientRepository.create(seedData);
        await this.patientRepository.save(patients);
        this.logger.log(`Seeded ${seedData.length} initial clinical patients in Neon DB`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial patients: ${err.message}`);
    }
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto as any);
    const saved = await this.patientRepository.save(patient);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(query?: { search?: string; condition?: string; doctorId?: string; status?: string }): Promise<Patient[]> {
    const qb = this.patientRepository.createQueryBuilder('patient');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(patient.name) LIKE :search OR LOWER(patient.email) LIKE :search OR LOWER(patient.condition) LIKE :search OR LOWER(patient.doctorName) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }
    if (query?.condition && query.condition !== 'all') {
      qb.andWhere('patient.condition = :condition', { condition: query.condition });
    }
    if (query?.doctorId && query.doctorId !== 'all') {
      qb.andWhere('patient.doctorId = :doctorId', { doctorId: query.doctorId });
    }
    if (query?.status && query.status !== 'all') {
      qb.andWhere('patient.status = :status', { status: query.status });
    }

    return qb.orderBy('patient.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updateDto: Partial<CreatePatientDto>): Promise<Patient> {
    const patient = await this.findById(id);
    Object.assign(patient, updateDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const patient = await this.findById(id);
    await this.patientRepository.remove(patient);
    return { deleted: true, message: `Patient ${id} successfully removed` };
  }
}
