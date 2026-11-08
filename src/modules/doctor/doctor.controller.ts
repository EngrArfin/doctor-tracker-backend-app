import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DoctorService } from './doctor.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new doctor (Admin only)' })
  @ApiResponse({ status: 201, description: 'Doctor created' })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorService.create(createDoctorDto);
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all doctors with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'specialization', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('specialization') specialization?: string,
    @Query('status') status?: string,
  ) {
    const doctors = await this.doctorService.findAll({ search, specialization, status });
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor details by ID' })
  async findOne(@Param('id') id: string) {
    const doctor = await this.doctorService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Doctor retrieved successfully',
      data: doctor,
    };
  }

  @Get(':id/patients')
  @ApiOperation({ summary: 'Get all patients assigned to a specific doctor' })
  async getDoctorPatients(@Param('id') id: string) {
    const patients = await this.doctorService.getPatientsByDoctorId(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Update doctor information' })
  async update(@Param('id') id: string, @Body() updateDoctorDto: Partial<CreateDoctorDto>) {
    const updated = await this.doctorService.update(id, updateDoctorDto);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Doctor updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete doctor record (Admin only)' })
  async remove(@Param('id') id: string) {
    const result = await this.doctorService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    };
  }
}

