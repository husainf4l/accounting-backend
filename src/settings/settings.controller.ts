import {
  Controller,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('company-settings')
  async getCompanySettings(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.settingsService.getCompanySettings(companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('company-settings/update')
  async updateCompanySettings(
    @Req() req: any,
    @Body() updates: any,
  ): Promise<any> {
    try {
      const companyId = req.user.companyId;
      const updatedCompany = await this.settingsService.updateCompanyData(
        updates,
        companyId,
      );

      return {
        message: 'Company data updated successfully',
        data: updatedCompany,
      };
    } catch (error) {
      console.error('Error updating company data:', error);
      throw new HttpException(
        error.message || 'Failed to update company data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllCompanies(@Req() req: any) {
    console.log('User:', req.user);
    const userId = req.user.userId;
    console.log(userId);

    return await this.settingsService.getAllCompanies(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-company')
  async updateCompany(@Req() req, @Body('companyId') newCompanyId: string) {
    console.log('JWT User:', req.user);

    const userId = req.user.userId; // Check if this is defined
    console.log('Extracted UserID:', userId);
    console.log('New CompanyID:', newCompanyId);

    if (!userId) {
      throw new Error('User ID not found in token.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: newCompanyId },
    });

    const newToken = await this.authService.refreshUserToken(userId);
    return { token: newToken };
  }
}
