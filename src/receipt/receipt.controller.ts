import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/CreateReceiptDto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }


  @Get('receipt-data')
  async getReceiptData() {
    return this.receiptService.getReceiptData()
  }
  
  @Post()
  async createReceipt(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.createReceipt(createReceiptDto);
  }

}
