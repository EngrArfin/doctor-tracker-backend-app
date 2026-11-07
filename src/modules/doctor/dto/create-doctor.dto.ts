import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. Sarah Jenkins' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sarah.jenkins@mayoclinic.org' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1 (555) 234-8901' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ example: 'Mayo Clinic Healthcare' })
  @IsString()
  @IsNotEmpty()
  hospital: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 42 })
  @IsNumber()
  @IsOptional()
  patientsCount?: number;

  @ApiPropertyOptional({ example: 'Active', enum: ['Active', 'On Leave', 'Inactive'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 14 })
  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @ApiPropertyOptional({ example: 4.9 })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'West Wing 402' })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiPropertyOptional({ example: 'Board-certified cardiologist specializing in structural heart interventions.' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'Harvard Medical School' })
  @IsString()
  @IsOptional()
  education?: string;

  @ApiPropertyOptional({ example: 250 })
  @IsNumber()
  @IsOptional()
  consultationFee?: number;
}

