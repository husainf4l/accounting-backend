import { Module } from '@nestjs/common';
import { XmlReceiverService } from './xml-receiver.service';
import { XmlReceiverController } from './xml-receiver.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [XmlReceiverController],
  providers: [XmlReceiverService],
  exports: [XmlReceiverService],
})
export class XmlReceiverModule {}
