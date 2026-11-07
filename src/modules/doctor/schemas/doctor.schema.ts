import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

export type DoctorSpecialization =
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Dermatology'
  | 'Oncology'
  | 'Psychiatry'
  | 'General Medicine';

export type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Doctor {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, default: 'General Medicine' })
  specialization: string;

  @Prop({ required: true, trim: true })
  hospital: string;

  @Prop({ default: '' })
  avatarUrl?: string;

  @Prop({ default: 0 })
  patientsCount: number;

  @Prop({ default: () => new Date().toISOString().split('T')[0] })
  joinedDate: string;

  @Prop({ default: 'Active' })
  status: DoctorStatus;

  @Prop({ default: 5 })
  experienceYears: number;

  @Prop({ default: 4.8 })
  rating: number;

  @Prop({ default: '' })
  roomNumber?: string;

  @Prop({ default: '' })
  bio?: string;

  @Prop({ default: '' })
  education?: string;

  @Prop({ default: 200 })
  consultationFee?: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

