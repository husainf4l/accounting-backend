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

    @UseGuards(AuthGuard('jwt'))
    @Get('invoice-details/:invoiceId')
    async getInvoiceDetails(@Param('invoiceId') invoiceId: string) {
        return this.invoiceService.getInvoiceDetails(invoiceId);
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createInvoice(@Req() req: any, @Body() createInvoiceDto: any) {
        const companyId = req.user.companyId;

        return this.invoiceService.createInvoice(createInvoiceDto, companyId);
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('invoices-data')
    async getInvoicesDetails(@Req() req: any,) {
        const companyId = req.user.companyId;
        return this.invoiceService.getInvoicesDetails(companyId);
    }


    @Post('purchase')
    async createPurchase(@Body() data: any, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.invoiceService.createPurchaseInvoice(data, companyId);
    }

    @Get('purchase/:id')
    async getPurchaseDetails(@Param('id') id: string) {
        return this.invoiceService.getPurchaseInvoiceDetails(id);
    }





    @UseGuards(AuthGuard('jwt'))
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

    @UseGuards(AuthGuard('jwt'))
    @Get('purchase-data')
    async getPurchaseData(@Req() req: any) {
        const companyId = req.user.companyId;
        console.log('Company ID:', companyId);

        return this.invoiceService.getPurchaseData(companyId);
    }
}
