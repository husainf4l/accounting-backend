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

  async getCompanySettings(companyId: string): Promise<any> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found.`);
    }

    return company;
  }

  async updateCompanyData(updates: any, companyId: string): Promise<any> {
    // Extract the company ID from the token

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: { ...updates },
    });

    return updatedCompany;
  }

  async getAllCompanies(userId: string) {
    return await this.prisma.userCompany.findMany({
      where: {
        userId: userId,
      },
      include: {
        company: true,
        user: true,
      },
    });
  }

  // Update companyId for an account
  async updateAccountCompany(userId: string, companyId: string) {
    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Update account with companyId
    return await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: companyId },
    });
  }
}
