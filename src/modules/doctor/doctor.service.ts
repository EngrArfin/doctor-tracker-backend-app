import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService implements OnModuleInit {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async onModuleInit() {
    await this.seedInitialDoctors();
  }

  async seedInitialDoctors() {
    try {
      const count = await this.doctorRepository.count();
      if (count < 8) {
        const seedData = [
          {
            name: 'Dr. Sarah Jenkins',
            email: 'sarah.jenkins@mayoclinic.org',
            phone: '+1 (555) 234-8901',
            specialization: 'Cardiology',
            hospital: 'Mayo Clinic Healthcare',
            avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 42,
            joinedDate: '2023-01-15',
            status: 'Active' as const,
            experienceYears: 14,
            rating: 4.9,
            roomNumber: 'West Wing 402',
            bio: 'Board-certified cardiologist specializing in structural heart interventions and preventative cardiology.',
            education: 'Harvard Medical School (MD, Cardiology Fellowship)',
            consultationFee: 250,
          },
          {
            name: 'Dr. Marcus Vance',
            email: 'marcus.vance@hopkins.edu',
            phone: '+1 (555) 345-6789',
            specialization: 'Neurology',
            hospital: 'Johns Hopkins Hospital',
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 38,
            joinedDate: '2023-03-20',
            status: 'Active' as const,
            experienceYears: 12,
            rating: 4.8,
            roomNumber: 'Neuro Block 210',
            bio: 'Lead neurologist focused on neurovascular disorders, epilepsy, and migraine therapy regimens.',
            education: 'Johns Hopkins University School of Medicine',
            consultationFee: 280,
          },
          {
            name: 'Dr. Elena Rostova',
            email: 'elena.rostova@mountsinai.org',
            phone: '+1 (555) 456-7890',
            specialization: 'Pediatrics',
            hospital: 'Mount Sinai Medical Center',
            avatarUrl: 'https://images.unsplash.com/photo-1594824813575-2742918803a6?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 56,
            joinedDate: '2022-11-05',
            status: 'Active' as const,
            experienceYears: 10,
            rating: 4.9,
            roomNumber: 'Pediatric Pavilion 104',
            bio: 'Compassionate pediatric specialist caring for infant development, childhood immunity, and pediatric asthma.',
            education: 'Columbia University Vagelos College of Physicians and Surgeons',
            consultationFee: 210,
          },
          {
            name: 'Dr. David Chen',
            email: 'david.chen@stanfordmed.org',
            phone: '+1 (555) 567-8901',
            specialization: 'Orthopedics',
            hospital: 'Stanford Health Care',
            avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 34,
            joinedDate: '2023-05-12',
            status: 'Active' as const,
            experienceYears: 16,
            rating: 4.7,
            roomNumber: 'Orthopedic Suite 512',
            bio: 'Orthopedic surgeon specializing in sports medicine, joint replacements, and arthroscopic reconstructions.',
            education: 'Stanford University School of Medicine',
            consultationFee: 310,
          },
          {
            name: 'Dr. Priya Patel',
            email: 'priya.patel@mgh.harvard.edu',
            phone: '+1 (555) 678-9012',
            specialization: 'Dermatology',
            hospital: 'Massachusetts General Hospital',
            avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 29,
            joinedDate: '2023-08-01',
            status: 'Active' as const,
            experienceYears: 8,
            rating: 4.9,
            roomNumber: 'Derma Wing 108',
            bio: 'Clinical dermatologist with expertise in inflammatory skin conditions, oncologic dermatology, and laser therapies.',
            education: 'Yale School of Medicine',
            consultationFee: 240,
          },
          {
            name: 'Dr. Robert Thorne',
            email: 'robert.thorne@clevelandclinic.org',
            phone: '+1 (555) 789-0123',
            specialization: 'Oncology',
            hospital: 'Cleveland Clinic',
            avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 25,
            joinedDate: '2022-09-18',
            status: 'On Leave' as const,
            experienceYears: 18,
            rating: 4.8,
            roomNumber: 'Cancer Care Center 303',
            bio: 'Senior medical oncologist committed to targeted immunotherapies and personalized clinical trials.',
            education: 'University of Pennsylvania Perelman School of Medicine',
            consultationFee: 350,
          },
          {
            name: 'Dr. Maya Lin',
            email: 'maya.lin@nyulangone.org',
            phone: '+1 (555) 890-1234',
            specialization: 'Psychiatry',
            hospital: 'NYU Langone Health',
            avatarUrl: 'https://images.unsplash.com/photo-1594824813575-2742918803a6?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 31,
            joinedDate: '2023-09-10',
            status: 'Active' as const,
            experienceYears: 9,
            rating: 4.9,
            roomNumber: 'Behavioral Health 215',
            bio: 'Adult psychiatrist specializing in mood disorders, cognitive behavioral integration, and neurofeedback.',
            education: 'Weill Cornell Medicine',
            consultationFee: 260,
          },
          {
            name: 'Dr. Arthur Pendelton',
            email: 'arthur.p@cedarssinai.org',
            phone: '+1 (555) 901-2345',
            specialization: 'General Medicine',
            hospital: 'Cedars-Sinai Medical Center',
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
            patientsCount: 65,
            joinedDate: '2021-06-14',
            status: 'Active' as const,
            experienceYears: 22,
            rating: 4.6,
            roomNumber: 'Primary Care Suite 101',
            bio: 'Primary care physician providing comprehensive diagnostic screenings and chronic disease management.',
            education: 'UCLA David Geffen School of Medicine',
            consultationFee: 195,
          },
        ];

        for (const item of seedData) {
          const exists = await this.doctorRepository.findOne({ where: { email: item.email } });
          if (!exists) {
            await this.doctorRepository.save(this.doctorRepository.create(item));
          }
        }
        this.logger.log(`Initialized full clinical doctor directory in Neon DB`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial doctors: ${err.message}`);
    }
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto as any);
    const saved = await this.doctorRepository.save(doctor);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(query?: { search?: string; specialization?: string; status?: string }): Promise<Doctor[]> {
    const qb = this.doctorRepository.createQueryBuilder('doctor');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(doctor.name) LIKE :search OR LOWER(doctor.email) LIKE :search OR LOWER(doctor.hospital) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }
    if (query?.specialization && query.specialization !== 'all') {
      qb.andWhere('doctor.specialization = :specialization', { specialization: query.specialization });
    }
    if (query?.status && query.status !== 'all') {
      qb.andWhere('doctor.status = :status', { status: query.status });
    }

    return qb.orderBy('doctor.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async getPatientsByDoctorId(doctorId: string): Promise<Patient[]> {
    // Check doctor exists
    await this.findById(doctorId);
    return this.patientRepository.find({
      where: { doctorId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDto: Partial<CreateDoctorDto>): Promise<Doctor> {
    const doctor = await this.findById(id);
    Object.assign(doctor, updateDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const doctor = await this.findById(id);
    await this.doctorRepository.remove(doctor);
    return { deleted: true, message: `Doctor ${id} successfully removed` };
  }
}
