import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService implements OnModuleInit {
  private readonly logger = new Logger(DoctorService.name);

  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async onModuleInit() {
    await this.seedInitialDoctors();
  }

  private async seedInitialDoctors() {
    try {
      const count = await this.doctorModel.countDocuments();
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
            status: 'Active',
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
            status: 'Active',
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
            status: 'Active',
            experienceYears: 10,
            rating: 4.9,
            roomNumber: 'Pediatric Pavilion 104',
            bio: 'Dedicated pediatrician with special focus on neonatology and developmental pediatrics.',
            education: 'Columbia University Vagelos College of Physicians and Surgeons',
            consultationFee: 220,
          },
        ];
        await this.doctorModel.insertMany(seedData);
        this.logger.log(`Seeded ${seedData.length} initial clinical doctors`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial doctors: ${err.message}`);
    }
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorDocument> {
    const createdDoctor = new this.doctorModel(createDoctorDto);
    return createdDoctor.save();
  }

  async findAll(query?: { search?: string; specialization?: string; status?: string }): Promise<DoctorDocument[]> {
    const filter: any = {};
    if (query?.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { hospital: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query?.specialization && query.specialization !== 'all') {
      filter.specialization = query.specialization;
    }
    if (query?.status && query.status !== 'all') {
      filter.status = query.status;
    }
    return this.doctorModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDto: Partial<CreateDoctorDto>): Promise<DoctorDocument> {
    const updated = await this.doctorModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const result = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return { deleted: true, message: `Doctor ${id} successfully removed` };
  }
}

