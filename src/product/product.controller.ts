import { Controller, Post, UseInterceptors, UploadedFile, Body, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {

    constructor(private readonly productsService: ProductService) {}


    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads', // Directory where files will be stored
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            cb(null, filename);
          },
        }),
      }),
    )
    async uploadProducts(@UploadedFile() file: Express.Multer.File) {
      console.log('Started', file);
  
      const filePath = path.resolve(file.path); // Resolve the file path
      console.log('File Path:', filePath);
  
      const result = await this.productsService.uploadProducts(filePath);
      return result;
    }


  
  
}
