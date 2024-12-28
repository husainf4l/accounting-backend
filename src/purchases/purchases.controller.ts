import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) { }

  @Post('purchase')
  async createPurchase(@Body() data: any, @Req() req: any) {
    const companyId = req.user.companyId;
    return this.purchasesService.createPurchaseInvoice(data, companyId);
  }

  @Get('purchase/:id')
  async getPurchaseDetails(@Param('id') id: string) {
    return this.purchasesService.getPurchaseInvoiceDetails(id);
  }




  @UseGuards(AuthGuard('jwt'))
  @Get('purchase-data')
  async getPurchaseData(@Req() req: any) {
    const companyId = req.user.companyId;
    console.log('Company ID:', companyId);

    return this.purchasesService.getPurchaseData(companyId);
  }

}
