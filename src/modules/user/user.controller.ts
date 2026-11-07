import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all registered users' })
  async findAll() {
    const users = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Patch('update/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user role or profile' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateRoleOrUser(@Param('id') id: string, @Body() body: UpdateUserDto & UpdateUserRoleDto) {
    const updated = await this.userService.update(id, body);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: updated,
    };
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.userService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: updated,
    };
  }

  @Delete('delete/:id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID (Used by frontend)' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Standard REST Delete user by ID' })
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    };
  }
}

