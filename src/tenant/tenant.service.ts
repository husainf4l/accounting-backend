import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { exec } from 'child_process';
import { promisify } from 'util';


const pgPromise = require('pg-promise'); // Correct import for CommonJS
const pgp = pgPromise();

const execAsync = promisify(exec);

@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createTenant(createTenantDto: CreateTenantDto) {
    const { name, databaseName, region } = createTenantDto;

    // Step 1: Connect to the default PostgreSQL database
    const db = pgp({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: 'postgres', // Default database to create other databases
    });

    // Step 2: Create the new database
    try {
      await db.none(`CREATE DATABASE $1:name`, [databaseName]);
      console.log(`Database ${databaseName} created successfully.`);

      // Step 3: Apply migrations to the new database
      const tenantDatabaseUrl = this.constructDatabaseUrl(databaseName);
      process.env.DATABASE_URL = tenantDatabaseUrl;
      await execAsync(
        `npx prisma migrate deploy --schema=prisma/tenant-schema.prisma`,
      );
      console.log(`Migrations applied to database: ${databaseName}`);

      // Step 4: Store tenant metadata in the admin database
      const tenant = await this.prisma.tenant.create({
        data: {
          name,
          databaseUrl: tenantDatabaseUrl,
          region,
        },
      });

      return tenant;
    } catch (error) {
      console.error(`Error creating tenant database: ${error.message}`);
      throw error;
    } finally {
      pgp.end(); // Close the connection
    }
  }

  private constructDatabaseUrl(databaseName: string): string {
    const user = this.configService.get<string>('DB_USER');
    const password = this.configService.get<string>('DB_PASSWORD');
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<string>('DB_PORT');

    return `postgresql://${user}:${password}@${host}:${port}/${databaseName}`;
  }
}
