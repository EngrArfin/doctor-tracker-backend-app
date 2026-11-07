import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Root & Health Check' })
  @ApiResponse({ status: 200, description: 'Service operational' })
  getHealth() {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Doctor Tracker Clinical Backend API is running',
      version: '1.0.0',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }
}
