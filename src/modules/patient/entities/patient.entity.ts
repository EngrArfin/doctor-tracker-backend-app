import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PatientStatus = 'Active' | 'Recovered' | 'Under Observation' | 'Critical';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  age: number;

  @Column({ default: 'Male' })
  gender: string;

  @Column()
  condition: string;

  @Column({ default: 'Active' })
  status: PatientStatus;

  @Column({ default: '' })
  doctorId: string;

  @Column({ default: '' })
  doctorName: string;

  @Column({ default: '' })
  registeredDate: string;

  @Column({ default: '' })
  lastVisitDate: string;

  @Column({ default: '' })
  avatarUrl: string;

  @Column({ default: 'O+' })
  bloodGroup: string;

  @Column({ default: '' })
  emergencyContact: string;

  @Column({ default: '' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

