import { Controller, Get, Post, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregated hospital dashboard statistics and KPIs' })
  @ApiResponse({ status: 200, description: 'Aggregated analytics data' })
  async getStats() {
    const stats = await this.dashboardService.getStats();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    };
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get monthly admission and registration trends' })
  @ApiResponse({ status: 200, description: 'Monthly registration and admission trends' })
  async getTrends() {
    const trends = await this.dashboardService.getTrends();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Dashboard trends retrieved successfully',
      data: trends,
    };
  }

  @Get('patients-per-doctor')
  @ApiOperation({ summary: 'Get patient caseload metric per doctor for comparative charts' })
  @ApiResponse({ status: 200, description: 'Caseload per physician metrics' })
  async getPatientsPerDoctor() {
    const data = await this.dashboardService.getPatientsPerDoctor();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Patients per doctor retrieved successfully',
      data,
    };
  }

  @Get('specializations')
  @ApiOperation({ summary: 'Get clinical specialization distribution and percentages' })
  @ApiResponse({ status: 200, description: 'Specialization breakdown with slice colors' })
  async getSpecializations() {
    const data = await this.dashboardService.getSpecializations();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Specialization distribution retrieved successfully',
      data,
    };
  }

  @Post('reset')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Reset hospital records to original baseline (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reset confirmation' })
  async resetData() {
    const result = await this.dashboardService.resetData();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    };
  }
}

