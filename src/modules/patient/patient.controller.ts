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
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Admit or register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient admitted successfully' })
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.create(createPatientDto);
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Patient registered successfully',
      data: patient,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients with filtering' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('condition') condition?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
  ) {
    const patients = await this.patientService.findAll({ search, condition, doctorId, status });
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  async findOne(@Param('id') id: string) {
    const patient = await this.patientService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Patient retrieved successfully',
      data: patient,
    };
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Update patient clinical record' })
  async update(@Param('id') id: string, @Body() updatePatientDto: Partial<CreatePatientDto>) {
    const updated = await this.patientService.update(id, updatePatientDto);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Patient record updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remove patient record' })
  async remove(@Param('id') id: string) {
    const result = await this.patientService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    };
  }
}

