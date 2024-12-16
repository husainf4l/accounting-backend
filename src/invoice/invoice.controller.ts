import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { XmlReceiverService } from 'src/xml-receiver/xml-receiver.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService, private readonly xmlReceiverService: XmlReceiverService) { }



    @UseGuards(AuthGuard('jwt'))
    @Get('invoice-data')
    async getInvoiceClients(@Req() req: any) {
        const companyId = req.user.companyId;
        console.log('Company ID:', companyId);

        return this.invoiceService.getInvoiceData(companyId);
    }

    @Get('invoice-details/:invoiceId')
    async getInvoiceDetails(@Param('invoiceId') invoiceId: string) {
        return this.invoiceService.getInvoiceDetails(invoiceId);
    }

    @Post('create')
    async createInvoice(@Req() req: any, @Body() createInvoiceDto: any) {
        const companyId = req.user.companyId;

        return this.invoiceService.createInvoice(createInvoiceDto, companyId);
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
