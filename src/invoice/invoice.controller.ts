import { Body, Controller, Get, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }



    @Get('invoice-data')
    async getInvoiceClients() {
        return this.invoiceService.getInvoiceData();
    }


    @Post('create')
    async createInvoice(@Body() createInvoiceDto: any) {
        return this.invoiceService.createInvoice(createInvoiceDto);
    }

}
