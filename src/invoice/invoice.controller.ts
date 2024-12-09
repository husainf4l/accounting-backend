import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }



    @Get('invoice-data')
    async getInvoiceClients() {
        return this.invoiceService.getInvoiceData();
    }

    @Get('invoice-details/:invoiceId')
    async getInvoiceDetails(@Param('invoiceId') invoiceId: string) {
        return this.invoiceService.getInvoiceDetails(invoiceId);
    }

    @Post('create')
    async createInvoice(@Body() createInvoiceDto: any) {
        return this.invoiceService.createInvoice(createInvoiceDto);
    }


}
