import { Body, Controller, Post } from '@nestjs/common';
import { XmlReceiverService } from './xml-receiver.service';

@Controller('xml-receiver2')
export class XmlReceiverController {
  constructor(private readonly xmlReceiverService: XmlReceiverService) { }



}
