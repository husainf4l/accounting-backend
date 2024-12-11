import { Body, Controller, Post } from '@nestjs/common';
import { XmlReceiverService } from './xml-receiver.service';

@Controller('xml-receiver2')
export class XmlReceiverController {
  constructor(private readonly xmlReceiverService: XmlReceiverService) { }


  @Post('receive')
  async receiveInvoice(@Body() body: string) {
    // Body is expected to be XML data
    const parsedData = await this.xmlReceiverService.receiveInvoiceXml(body);
    return { success: true, data: parsedData };
  }
}
