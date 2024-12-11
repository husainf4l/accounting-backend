import { Module } from '@nestjs/common';
import { XmlReceiverService } from './xml-receiver.service';
import { XmlReceiverController } from './xml-receiver.controller';

@Module({
  controllers: [XmlReceiverController],
  providers: [XmlReceiverService],
})
export class XmlReceiverModule {}
