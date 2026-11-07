import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/entities/user.entity';
import { Doctor } from './modules/doctor/entities/doctor.entity';
import { Patient } from './modules/patient/entities/patient.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const defaultPostgresUrl =
  'postgresql://neondb_owner:npg_1ze9aBnUdNQj@ep-wild-recipe-beirhpqi-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

const appImports: (any | DynamicModule)[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('DATABASE_URL') || defaultPostgresUrl;
      return {
        type: 'postgres',
        url,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User, Doctor, Patient],
        synchronize: true,
        autoLoadEntities: true,
      };
    },
    inject: [ConfigService],
  }),
  UserModule,
  AuthModule,
  DoctorModule,
  PatientModule,
  DashboardModule,
];

if (
  process.env.OBSERVE_APP_KEY &&
  process.env.OBSERVE_APP_KEY !== 'YOUR_APP_KEY' &&
  !process.env.VERCEL
) {
  appImports.push(
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY,
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'doctor-tracker-backend-app',
    }),
  );
}

@Module({
  imports: appImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
