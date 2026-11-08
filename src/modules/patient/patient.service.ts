import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity.js';
import { Doctor } from '../doctor/entities/doctor.entity.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Injectable()
export class PatientService implements OnModuleInit {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async onModuleInit() {
    await this.seedInitialPatients();
  }

  private async seedInitialPatients() {
    try {
      const count = await this.patientRepository.count();
      if (count < 10) {
        const seedData = [
          {
            name: 'Eleanor Vance',
            email: 'eleanor.vance@example.com',
            phone: '+1 (555) 101-2020',
            age: 48,
            gender: 'Female',
            condition: 'Hypertension',
            status: 'Active' as const,
            doctorName: 'Dr. Sarah Jenkins',
            registeredDate: '2024-01-10',
            lastVisitDate: '2024-02-18',
            bloodGroup: 'A+',
            emergencyContact: '+1 (555) 101-2021 (Husband - Robert)',
            notes: 'Prescribed lisinopril 10mg daily. Blood pressure steady at 124/82.',
          },
          {
            name: 'Liam Henderson',
            email: 'liam.h@example.com',
            phone: '+1 (555) 202-3030',
            age: 34,
            gender: 'Male',
            condition: 'Migraine',
            status: 'Under Observation' as const,
            doctorName: 'Dr. Marcus Vance',
            registeredDate: '2024-01-14',
            lastVisitDate: '2024-02-22',
            bloodGroup: 'O+',
            emergencyContact: '+1 (555) 202-3031 (Sister - Alice)',
            notes: 'Undergoing migraine trigger diary. MRI scheduled for mid-March.',
          },
          {
            name: 'Sophia Martinez',
            email: 'sophia.m@example.com',
            phone: '+1 (555) 303-4040',
            age: 8,
            gender: 'Female',
            condition: 'Asthma',
            status: 'Active' as const,
            doctorName: 'Dr. Elena Rostova',
            registeredDate: '2023-12-05',
            lastVisitDate: '2024-02-15',
            bloodGroup: 'B+',
            emergencyContact: '+1 (555) 303-4041 (Mother - Maria)',
            notes: 'Mild pediatric asthma. Responding well to fluticasone inhaler regimen.',
          },
          {
            name: 'Benjamin Hayes',
            email: 'b.hayes@example.com',
            phone: '+1 (555) 404-5050',
            age: 29,
            gender: 'Male',
            condition: 'Post-op Recovery',
            status: 'Active' as const,
            doctorName: 'Dr. David Chen',
            registeredDate: '2024-01-22',
            lastVisitDate: '2024-02-20',
            bloodGroup: 'AB+',
            emergencyContact: '+1 (555) 404-5051 (Father - Thomas)',
            notes: 'ACL reconstruction recovery. Physical therapy 3x weekly progressing smoothly.',
          },
          {
            name: 'Clara Oswald',
            email: 'clara.oswald@example.com',
            phone: '+1 (555) 505-6060',
            age: 39,
            gender: 'Female',
            condition: 'Eczema Flare-up',
            status: 'Recovered' as const,
            doctorName: 'Dr. Priya Patel',
            registeredDate: '2023-11-19',
            lastVisitDate: '2024-01-29',
            bloodGroup: 'O-',
            emergencyContact: '+1 (555) 505-6061 (Partner - Danny)',
            notes: 'Topical corticosteroid course completed. Barrier skin restored.',
          },
          {
            name: 'Jonathan Sterling',
            email: 'jonathan.s@example.com',
            phone: '+1 (555) 606-7070',
            age: 62,
            gender: 'Male',
            condition: 'Lymphoma Screening',
            status: 'Under Observation' as const,
            doctorName: 'Dr. Robert Thorne',
            registeredDate: '2023-10-04',
            lastVisitDate: '2024-02-10',
            bloodGroup: 'A-',
            emergencyContact: '+1 (555) 606-7071 (Son - Lucas)',
            notes: 'Follow-up PET-CT scan reviewed. Remission maintenance on schedule.',
          },
          {
            name: 'Emily Watson',
            email: 'emily.w@example.com',
            phone: '+1 (555) 707-8080',
            age: 31,
            gender: 'Female',
            condition: 'Generalized Anxiety',
            status: 'Active' as const,
            doctorName: 'Dr. Maya Lin',
            registeredDate: '2024-02-01',
            lastVisitDate: '2024-02-25',
            bloodGroup: 'B-',
            emergencyContact: '+1 (555) 707-8081 (Friend - Claire)',
            notes: 'Bi-weekly therapy sessions with SSRI titration. Anxiety scores lowering.',
          },
          {
            name: 'Harold Finch',
            email: 'harold.finch@example.com',
            phone: '+1 (555) 808-9090',
            age: 55,
            gender: 'Male',
            condition: 'Type 2 Diabetes',
            status: 'Active' as const,
            doctorName: 'Dr. Arthur Pendelton',
            registeredDate: '2023-09-12',
            lastVisitDate: '2024-02-14',
            bloodGroup: 'O+',
            emergencyContact: '+1 (555) 808-9091 (Colleague - John)',
            notes: 'HbA1c decreased from 8.2% to 6.9% following metformin and nutrition guidance.',
          },
          {
            name: 'Victoria Song',
            email: 'victoria.song@example.com',
            phone: '+1 (555) 909-0101',
            age: 44,
            gender: 'Female',
            condition: 'Arrhythmia',
            status: 'Under Observation' as const,
            doctorName: 'Dr. Sarah Jenkins',
            registeredDate: '2024-01-05',
            lastVisitDate: '2024-02-21',
            bloodGroup: 'A+',
            emergencyContact: '+1 (555) 909-0102 (Mother - Jane)',
            notes: 'Holter monitor showed intermittent premature atrial contractions. Monitoring.',
          },
          {
            name: 'Lucas Davenport',
            email: 'lucas.d@example.com',
            phone: '+1 (555) 010-1212',
            age: 12,
            gender: 'Male',
            condition: 'Allergic Rhinitis',
            status: 'Recovered' as const,
            doctorName: 'Dr. Elena Rostova',
            registeredDate: '2023-11-28',
            lastVisitDate: '2024-01-30',
            bloodGroup: 'O+',
            emergencyContact: '+1 (555) 010-1213 (Father - George)',
            notes: 'Antihistamine and allergen avoidance instructions provided. Symptoms resolved.',
          },
        ];

        for (const item of seedData) {
          const exists = await this.patientRepository.findOne({ where: { email: item.email } });
          if (!exists) {
            const doc = await this.doctorRepository.findOne({ where: { name: item.doctorName } });
            const patientData = {
              ...item,
              doctorId: doc ? doc.id : '',
            };
            await this.patientRepository.save(this.patientRepository.create(patientData));
          }
        }
        this.logger.log(`Initialized full clinical patient registry in Neon DB`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial patients: ${err.message}`);
    }
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto as any);
    const saved = await this.patientRepository.save(patient);
    const savedPatient = Array.isArray(saved) ? saved[0] : saved;

    if (savedPatient.doctorId) {
      const doc = await this.doctorRepository.findOne({ where: { id: savedPatient.doctorId } });
      if (doc) {
        doc.patientsCount += 1;
        await this.doctorRepository.save(doc);
      }
    }

    return savedPatient;
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
    if (patient.doctorId) {
      const doc = await this.doctorRepository.findOne({ where: { id: patient.doctorId } });
      if (doc && doc.patientsCount > 0) {
        doc.patientsCount -= 1;
        await this.doctorRepository.save(doc);
      }
    }
    await this.patientRepository.remove(patient);
    return { deleted: true, message: `Patient ${id} successfully removed` };
  }
}
