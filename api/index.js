const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { ValidationPipe } = require('@nestjs/common');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { AppModule, ObserveInstrument } = require('../dist/app.module');
const { AllExceptionsFilter } = require('../dist/common/filters/http-exception.filter');

let cachedServer;

async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    instrument: ObserveInstrument,
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

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
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  };

  SwaggerModule.setup('api/docs', app, document, customSwaggerOptions);
  SwaggerModule.setup('docs', app, document, customSwaggerOptions);

  await app.init();
  return expressApp;
}

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(req, res);
};

