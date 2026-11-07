import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService implements OnModuleInit {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async onModuleInit() {
    await this.seedInitialDoctors();
  }

  private async seedInitialDoctors() {
    try {
      const count = await this.doctorRepository.count();
      if (count === 0) {
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
            bio: 'Dedicated pediatrician with special focus on neonatology and developmental pediatrics.',
            education: 'Columbia University Vagelos College of Physicians and Surgeons',
            consultationFee: 220,
          },
        ];
        const doctors = this.doctorRepository.create(seedData);
        await this.doctorRepository.save(doctors);
        this.logger.log(`Seeded ${seedData.length} initial clinical doctors in Neon DB`);
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
