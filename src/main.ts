import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Enable CORS for frontend integration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global exception filter for unified error structure
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global DTO Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Professional Swagger (OpenAPI) Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Doctor Tracker API')
    .setDescription(
      'Comprehensive RESTful Healthcare Management API for Doctor Tracker. ' +
        'Engineered for hospital administrators and clinical staff to manage physicians, ' +
        'track patient caseloads, and access clinical telemetry analytics with JWT authentication.',
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication, JWT issuance, profile, and session management')
    .addTag('Users', 'User account and role administration')
    .addTag('Doctors', 'Physician credentialing, profiles, and caseloads')
    .addTag('Patients', 'Patient admissions, medical conditions, and registries')
    .addTag('Dashboard', 'Hospital analytics, KPIs, and caseload distribution')
    .addTag('Health', 'Service health check and telemetry status')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token (Bearer <token>)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const customSwaggerOptions = {
    customSiteTitle: 'Doctor Tracker API Documentation',
    customCss: `
      .topbar { background-color: #1e293b !important; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
      .swagger-ui .info { margin: 25px 0; }
      .swagger-ui .info .title { color: #2563eb; font-weight: 700; }
      .swagger-ui .btn.authorize { background-color: #2563eb; color: #fff; border-color: #2563eb; }
      .swagger-ui .btn.authorize svg { fill: #fff; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  };

  SwaggerModule.setup('api/docs', app, document, customSwaggerOptions);
  SwaggerModule.setup('docs', app, document, customSwaggerOptions);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger Documentation is live at: http://localhost:${port}/api/docs`);
  logger.log(`📚 Alternative Swagger Docs path:    http://localhost:${port}/docs`);
  logger.log(`🏥 Health Check endpoint:            http://localhost:${port}`);
  logger.log(`=======================================================`);
}

void bootstrap();
