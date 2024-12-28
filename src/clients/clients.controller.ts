import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateClientDto } from './dto/CreateClientDto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-new')
  async createClient(
    @Req() req: any,
    @Body() data: CreateClientDto, // Use DTO for validation
  ) {
    const companyId = req.user.companyId;

    try {
      const newClient = await this.clientsService.createClient(companyId, data);
      return {
        message: 'Client created successfully',
        client: newClient,
      };
    } catch (error) {
      return {
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

    try {
      const clients = await this.clientsService.getClients(companyId);
      return {
        message: 'Clients retrieved successfully',
        clients,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to fetch clients',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('bulk')
  async bulkUploadClients(
    @Req() req: any,
    @Body('clients') createClientDtos: CreateClientDto[],
  ) {
    if (!Array.isArray(createClientDtos)) {
      return {
        statusCode: 400,
        message: 'Invalid data format. Expected an array of clients.',
      };
    }

    const companyId = req.user.companyId;

    try {
      const clients = await this.clientsService.bulkCreateClients(createClientDtos, companyId);
      return {
        message: 'Clients uploaded successfully',
        clients,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to upload clients',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt')) // Add the guard for security
  @Get(':id/account-statement')
  async getAccountStatement(@Param('id') clientId: string, @Req() req: any) {
    const companyId = req.user.companyId;

    try {
      const accountStatement = await this.clientsService.getClientAccountStatement(clientId, companyId);
      return {
        message: 'Account statement retrieved successfully',
        accountStatement,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to fetch account statement',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/details')
  async getClientDetails(@Param('id') clientId: string, @Req() req: any) {
    const companyId = req.user.companyId;

    try {
      const clientDetails = await this.clientsService.getClientDetails(clientId, companyId);
      return {
        message: 'Client details retrieved successfully',
        clientDetails,
      };
    } catch (error) {
      throw {
        statusCode: 404,
        message: 'Client not found',
        error: error.message,
      };
    }
  }


}
