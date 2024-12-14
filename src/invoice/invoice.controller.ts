import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { XmlReceiverService } from 'src/xml-receiver/xml-receiver.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService, private readonly xmlReceiverService: XmlReceiverService) { }



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

    @Get('invoices-data')
    async getInvoicesDetails() {
        return this.invoiceService.getInvoicesDetails();
    }


    @Post('submitEinvoice')
    async sendInvoice(@Body() invoice: any): Promise<any> {
        try {
            const result = await this.xmlReceiverService.sendInvoiceTojofotara(invoice);
            if (result.status === 'ERROR') {
                return { success: false, error: result.message, details: result.details };
            }
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: 'Unexpected error', details: error.message };
        }
    }

}
