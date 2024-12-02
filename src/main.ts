// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const uploadsPath = join(__dirname, '..', '..', 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/api/uploads/',
  });

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(3001, '0.0.0.0');

}
bootstrap();
