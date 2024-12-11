import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyMultipart from '@fastify/multipart';
import fastifyXmlBodyParser from 'fastify-xml-body-parser';

interface Invoice {
  invoiceNumber: number;
  customer: {
    id: string;
  };
  date: string;
  total: number;
  taxAmount: number;
  grandTotal: number;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  // Register multipart (if needed) and XML parser
  await fastifyInstance.register(fastifyMultipart);
  app.setGlobalPrefix('api');
  app.enableCors({});

  // Register XML parser
  app.register(fastifyXmlBodyParser);

  // Define the route for receiving XML data
  fastifyInstance.post('/api/xml-receiver/receive', async (request, reply) => {
    try {
      // Access the parsed XML body and check if invoice exists
      const { invoice } = request.body as { invoice: Invoice };

      if (!invoice) {
        throw new Error('No invoice found in the request body');
      }

      // Log the invoice
      console.log('Received invoice:', invoice);

      // Process the invoice here
      return reply.send({ message: 'Invoice received successfully' });
    } catch (error) {
      console.error('Error processing XML:', error);
      return reply.status(400).send({ message: 'Error processing the invoice' });
    }
  });

  await app.listen(3001, '0.0.0.0');
  console.log('Application is running on: http://localhost:3001');
}

bootstrap();
