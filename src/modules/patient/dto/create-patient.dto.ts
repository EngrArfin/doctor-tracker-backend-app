import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Robert Chen' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'robert.chen@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1 (555) 789-0123' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 58 })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Other'] })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'Hypertension' })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Recovered', 'Under Observation', 'Critical'] })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: '64f1b2c3d4e5f6a7b8c9d0e2', description: 'Assigned Doctor MongoDB ID' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: 'Dr. Sarah Jenkins' })
  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @ApiPropertyOptional({ example: '2023-08-10' })
  @IsString()
  @IsOptional()
  registeredDate?: string;

  @ApiPropertyOptional({ example: '2023-09-01' })
  @IsString()
  @IsOptional()
  lastVisitDate?: string;

  @ApiPropertyOptional({ example: 'A+' })
  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @ApiPropertyOptional({ example: '+1 (555) 999-0000' })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: 'Patient responding well to antihypertensive therapy' })
  @IsString()
  @IsOptional()
  notes?: string;
}

