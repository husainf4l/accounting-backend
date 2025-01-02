import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/upload/upload.service';
import { JournalEntryModule } from 'src/journal-entry/journal-entry.module';

@Module({
  imports:[JournalEntryModule],
  providers: [ProductService, UploadService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }