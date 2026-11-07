import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

export type PatientStatus = 'Active' | 'Recovered' | 'Under Observation' | 'Critical';

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
export class Patient {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'], default: 'Male' })
  gender: string;

  @Prop({ required: true, trim: true })
  condition: string;

  @Prop({ required: true, default: 'Active' })
  status: PatientStatus;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  doctorName: string;

  @Prop({ default: () => new Date().toISOString().split('T')[0] })
  registeredDate: string;

  @Prop({ default: () => new Date().toISOString().split('T')[0] })
  lastVisitDate: string;

  @Prop({ default: '' })
  avatarUrl?: string;

  @Prop({ default: 'O+' })
  bloodGroup?: string;

  @Prop({ default: '' })
  emergencyContact?: string;

  @Prop({ default: '' })
  notes?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

