import {
  Controller,
  Post,
  Req,
  Inject,
  Get,
  UseGuards,
  Query,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as path from 'path';
import * as fs from 'fs';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  async uploadProducts(@Req() request: FastifyRequest, req: any): Promise<any> {
    const companyId = req.user.companyId;

    const file = await request.file();

    if (!file) {
      throw new Error('No file uploaded');
    }

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.filename);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;

    // Define the destination path
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // Ensure the upload directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Write the file to the destination
    const writeStream = fs.createWriteStream(filePath);

    for await (const chunk of file.file) {
      writeStream.write(chunk);
    }
    writeStream.end();

    console.log('File Path:', filePath);

    // Call the service to process the file
    const result = await this.productsService.uploadProducts(
      filePath,
      companyId,
    );
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-products')
  async allProducts(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.productsService.getProducts(companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('inventory')
  async getInventory(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const companyId = req.user.companyId;
    return this.productsService.inventory(companyId, startDate, endDate);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('inventory/export')
  async exportInventoryReport(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const companyId = req.user.companyId;
    const reportData = await this.productsService.generateReport(
      companyId,
      startDate,
      endDate,
    );

    // Placeholder for file generation logic
    return reportData;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stock-alerts')
  async getStockAlerts(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.productsService.getStockAlerts(companyId);
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Post('bulk')
  async createProducts(@Body('data') createProductDtos: CreateProductDto[]) {
    return this.productsService.createProducts(createProductDtos);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-inventory')
  async updateInventory(
    @Req() req: any,
    @Body() updates: UpdateInventoryDto[],
  ): Promise<void> {
    const companyId = req.user.companyId;

    for (const update of updates) {
      const product = await this.productsService.findBySKU(
        update.sku,
        companyId,
      );
      if (!product) {
        throw new NotFoundException(
          `Product ${update.sku} not found for company ${companyId}`,
        );
      }

      const totalCost = update.fifoLayers.reduce(
        (sum, layer) => sum + layer.quantity * layer.costPerUnit,
        0,
      );

      await this.productsService.updateProduct(
        product,
        companyId,
        update.updatedQuantity,
        totalCost,
      );

      for (const layer of update.fifoLayers) {
        await this.productsService.logInventoryMovement(
          product.id,
          companyId,
          'IN',
          layer.quantity,
          layer.costPerUnit,
        );
      }
    }
  }
}
