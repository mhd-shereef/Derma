import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3001;
  const nodeEnv = configService.get<string>('app.nodeEnv') ?? 'development';
  const frontendUrl = configService.get<string>('app.frontendUrl') ?? 'http://localhost:3000';
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix(apiPrefix);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  app.use(compression());

  const corsOrigins = frontendUrl.includes(',')
    ? frontendUrl.split(',').map((url) => url.trim()).filter(Boolean)
    : frontendUrl;

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app); // Method not available in this Prisma version

  const tenantMiddleware = app.get(TenantMiddleware);
  app.use((req: any, res: any, next: any) => tenantMiddleware.use(req, res, next));

  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('DERMA-AI API')
      .setDescription('Aesthetic Dermatology EMR API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication', 'Auth endpoints')
      .addTag('Users (Staff)', 'Staff management')
      .addTag('Patients', 'Patient management')
      .addTag('Appointments', 'Appointment & queue management')
      .addTag('Visits', 'Clinical visits & notes')
      .addTag('Photos', 'Clinical photo management')
      .addTag('Prescriptions', 'Prescription management')
      .addTag('Procedures', 'Procedures & packages')
      .addTag('Billing', 'Billing & invoicing')
      .addTag('Reports', 'Analytics & reports')
      .addTag('Audit', 'Audit logs')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);

  console.log(`🚀 DERMA-AI Backend running on http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}


bootstrap();