import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/upload/upload.service';

@Module({
  providers: [ProductService,UploadService],
  controllers: [ProductController]
})
export class ProductModule {}
