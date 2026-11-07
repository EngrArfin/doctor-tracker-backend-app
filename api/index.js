const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { ValidationPipe } = require('@nestjs/common');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const path = require('path');

let cachedServer;

async function bootstrapServer() {
  const expressApp = express();

  // Dynamically resolve dist/app.module
  const distPath = path.resolve(__dirname, '../dist');
  const { AppModule, ObserveInstrument } = require(path.join(distPath, 'app.module'));
  const { AllExceptionsFilter } = require(path.join(distPath, 'common/filters/http-exception.filter'));

  const options = {};
  if (ObserveInstrument && process.env.OBSERVE_APP_KEY) {
    options.instrument = ObserveInstrument;
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), options);

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
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
    }
    return cachedServer(req, res);
  } catch (err) {
    console.error('Serverless Handler Error:', err);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: 'Serverless Handler Initialization Error',
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
};
