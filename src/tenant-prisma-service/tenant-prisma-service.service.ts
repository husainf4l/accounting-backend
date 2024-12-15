import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantPrismaService {
  private clients: { [databaseUrl: string]: PrismaClient } = {};

  /**
   * Get a Prisma Client for a specific tenant database.
   */
  getClient(databaseUrl: string): PrismaClient {
    if (!this.clients[databaseUrl]) {
      const client = new PrismaClient({
        datasources: {
          db: { url: databaseUrl },
        },
      });

      this.clients[databaseUrl] = client;
    }

    return this.clients[databaseUrl];
  }

  /**
   * Disconnect all tenant database connections.
   */
  async disconnectAll() {
    for (const client of Object.values(this.clients)) {
      await client.$disconnect();
    }
  }
}
