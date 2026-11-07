import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

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
  async getTrends() {
    const trends = await this.dashboardService.getTrends();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Dashboard trends retrieved successfully',
      data: trends,
    };
  }
}

