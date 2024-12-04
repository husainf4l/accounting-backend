import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {


    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    async createClient(
        @Body() data: { name: string; email?: string; phone?: string; address?: string },
    ) {
        try {
            const newClient = await this.clientsService.createClient(data);
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


    @Get('invoice-clients')
    async getInvoiceClients() {
        return this.clientsService.getInvoiceClients();
    }
}
