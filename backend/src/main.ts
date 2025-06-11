import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Configurar CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Configurar filtro global de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar interceptor global de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configurar validation pipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Prefixo global para API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log(`🚀 Servidor rodando na porta ${port}`);
  logger.log(`📚 API disponível em: http://localhost:${port}/api`);
  logger.log(`📁 Uploads disponíveis em: http://localhost:${port}/uploads`);
}

bootstrap();