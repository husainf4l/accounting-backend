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
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { FastifyRequest } from 'fastify';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

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
}
