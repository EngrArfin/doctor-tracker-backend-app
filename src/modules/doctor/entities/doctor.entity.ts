import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: 'General Medicine' })
  specialization: string;

  @Column()
  hospital: string;

  @Column({ default: '' })
  avatarUrl: string;

  @Column({ default: 0 })
  patientsCount: number;

  @Column({ default: '' })
  joinedDate: string;

  @Column({ default: 'Active' })
  status: DoctorStatus;

  @Column({ default: 5 })
  experienceYears: number;

  @Column({ type: 'float', default: 4.8 })
  rating: number;

  @Column({ default: '' })
  roomNumber: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  education: string;

  @Column({ default: 200 })
  consultationFee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

