import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcryptjs';

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  phone: true,
  specialization: true,
  hospital: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);
    delete saved.password;
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: userSelectFields,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: userSelectFields,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    if (includePassword) {
      return this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      });
    }
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: userSelectFields,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return { deleted: true, message: `User ${id} successfully deleted` };
  }
}
