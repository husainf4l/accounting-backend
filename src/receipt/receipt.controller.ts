import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/CreateReceiptDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('receipt-data')
  async getReceiptData(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.receiptService.getReceiptData(companyId);
  }

  @Post()
  async createReceipt(@Req() req: any, @Body() createReceiptDto: CreateReceiptDto) {
    const companyId = req.user.companyId;

    return this.receiptService.createReceipt(createReceiptDto, companyId);
  }

  @Get('receipt-list')
  async getReceiptList() {
    return this.receiptService.getReceiptList();
  }
}
