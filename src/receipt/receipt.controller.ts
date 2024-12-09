import { Controller, Get } from '@nestjs/common';
import { ReceiptService } from './receipt.service';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }


  @Get('receipt-data')
  async getReceiptData() {
    return this.receiptService.getReceiptData()
  }
}
