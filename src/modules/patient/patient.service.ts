import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService implements OnModuleInit {
  private readonly logger = new Logger(PatientService.name);

  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async onModuleInit() {
    await this.seedInitialPatients();
  }

  private async seedInitialPatients() {
    try {
      const count = await this.patientModel.countDocuments();
      if (count === 0) {
        const seedData = [
          {
            name: 'Robert Chen',
            email: 'robert.chen@gmail.com',
            phone: '+1 (555) 789-0123',
            age: 58,
            gender: 'Male',
            condition: 'Hypertension',
            status: 'Active',
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
            status: 'Under Observation',
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
            status: 'Active',
            doctorId: 'doc-2',
            doctorName: 'Dr. Marcus Vance',
            registeredDate: '2023-10-05',
            lastVisitDate: '2024-02-10',
            bloodGroup: 'B+',
            emergencyContact: '+1 (555) 901-2346 (Mother - Patricia)',
            notes: 'CGRP antagonist started. Headache frequency reduced by 60%.',
          },
        ];
        await this.patientModel.insertMany(seedData);
        this.logger.log(`Seeded ${seedData.length} initial clinical patients`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial patients: ${err.message}`);
    }
  }

  async create(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
    const created = new this.patientModel(createPatientDto);
    return created.save();
  }

  async findAll(query?: { search?: string; condition?: string; doctorId?: string; status?: string }): Promise<PatientDocument[]> {
    const filter: any = {};
    if (query?.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { condition: { $regex: query.search, $options: 'i' } },
        { doctorName: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query?.condition && query.condition !== 'all') {
      filter.condition = query.condition;
    }
    if (query?.doctorId && query.doctorId !== 'all') {
      filter.doctorId = query.doctorId;
    }
    if (query?.status && query.status !== 'all') {
      filter.status = query.status;
    }
    return this.patientModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updateDto: Partial<CreatePatientDto>): Promise<PatientDocument> {
    const updated = await this.patientModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return { deleted: true, message: `Patient ${id} successfully removed` };
  }
}

