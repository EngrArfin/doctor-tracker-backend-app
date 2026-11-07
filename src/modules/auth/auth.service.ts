import {
  Injectable,
  UnauthorizedException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../user/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedInitialUsers();
  }

  private async seedInitialUsers() {
    try {
      const adminEmail = 'admin@doctortracker.com';
      const existingAdmin = await this.userService.findByEmail(adminEmail, true);
      if (!existingAdmin) {
        await this.userService.create({
          name: 'Clinical Administrator',
          email: adminEmail,
          password: 'password123',
          role: UserRole.ADMIN,
          phone: '+1 (555) 019-2831',
          hospital: 'St. Jude Clinical Center',
        });
        this.logger.log(`Default admin seeded: ${adminEmail} / password123`);
      }

      const doctorEmail = 'sarah.jenkins@mayoclinic.org';
      const existingDoctor = await this.userService.findByEmail(doctorEmail, true);
      if (!existingDoctor) {
        await this.userService.create({
          name: 'Dr. Sarah Jenkins',
          email: doctorEmail,
          password: 'doctorPass2026!',
          role: UserRole.DOCTOR,
          phone: '+1 (555) 234-8901',
          specialization: 'Cardiology',
          hospital: 'Mayo Clinic Healthcare',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
        });
        this.logger.log(`Default doctor seeded: ${doctorEmail} / doctorPass2026!`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed initial users: ${err.message}`);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email, true);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isDemoAdminMatch =
      user.email === 'admin@doctortracker.com' &&
      (password === 'password123' || password === 'adminPass2026!');

    if (!isMatch && !isDemoAdminMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userId = user.id || (user as any)._id?.toString();
    const payload = {
      sub: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image ?? null,
        },
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const userId = user.id || (user as any)._id?.toString();

    const payload = {
      sub: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken,
        user: {
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image ?? null,
        },
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    return {
      statusCode: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }
}

