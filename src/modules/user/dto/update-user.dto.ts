import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Dr. Sarah Jenkins' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ example: '+1 (555) 234-8901' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({ example: 'Mayo Clinic Healthcare' })
  @IsString()
  @IsOptional()
  hospital?: string;
}

export class UpdateUserRoleDto {
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN, description: 'Role to update (USER | ADMIN | DOCTOR)' })
  @IsEnum(UserRole)
  role: UserRole;
}

