import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(fastifyMultipart);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(3001, '0.0.0.0');
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();
