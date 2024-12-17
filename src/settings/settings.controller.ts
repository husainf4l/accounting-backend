import {
  Controller,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  Req,
  Patch,
  UseGuards,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService, private prisma: PrismaService,
    private authService: AuthService,
  ) { }

  @Get('company-settings')
  async getCompanySettings(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];

    return this.settingsService.getCompanySettings(token);
  }

  @Patch('company-settings/update')
  async updateCompanySettings(
    @Body() updates: any,
    @Headers('Authorization') token: string, // Retrieve the token from the header
  ): Promise<any> {
    try {
      // Pass the token and updates to the service
      const updatedCompany = await this.settingsService.updateCompanyData(
        updates,
        token,
      );

      console.log(updates);

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
  async getAllCompanies(@Req() req: any,) {
    console.log('User:', req.user);
    const userId = req.user.id;

    return await this.settingsService.getAllCompanies(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-company')
  async updateCompany(@Req() req, @Body('companyId') newCompanyId: string) {
    const userId = req.user.userId;

    // Step 1: Update the companyId in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: newCompanyId },
    });

    // Step 2: Generate a new token
    const newToken = await this.authService.refreshUserToken(userId);

    // Step 3: Return the new token
    return { token: newToken };
  }

}
