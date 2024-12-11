import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs-extra';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
    @Inject('FIREBASE_APP_OVOVEX')
    private readonly firebaseAppOvovex: admin.app.App,
  ) {}

  async getCompanySettings(token: string): Promise<any> {
    const companyId = this.authService.getCompanyId(token);

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found.`);
    }

    return company;
  }

  async updateCompanyData(updates: any, token: string): Promise<any> {
    // Extract the company ID from the token
    const companyId = this.authService.getCompanyId(token);

    if (!companyId) {
      throw new NotFoundException('Invalid or missing token.');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: { ...updates },
    });

    return updatedCompany;
  }
}
