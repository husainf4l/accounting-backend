import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post('create-new')
  async createClient(
    @Req() req: any,
    @Body()
    data: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;

    },
  ) {
    const companyId = req.user.companyId;

    try {

      const newClient = await this.clientsService.createClient(companyId, data);
      return {
        message: 'Client created successfully',
        client: newClient,
      };
    } catch (error) {
      throw {
        statusCode: 400,
        message: 'Failed to create client',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-clients')
  async getAllClients(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.clientsService.getClients(companyId);
  }
}
