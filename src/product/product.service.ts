import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadProducts(filePath: string): Promise<any> {
    console.log('Started processing file:', filePath);

    // Mapping columns to database fields
    const mapping = {
      A: 'barcode',
      B: 'name',
      C: 'description',
      D: 'costPrice',
      E: 'salesPrice',
      F: 'wholesalePrice',
      G: 'stock',
      H: 'reorderLevel',
      I: 'isActive',
      J: 'origin',
      K: 'taxRate',
    };

    // Process the Excel file and map columns
    const rows = await this.uploadService.processExcelFile(filePath, mapping);

    // Format the rows for database insertion
    const formattedRows = rows.map((row) => ({
      ...row,
      barcode: row.barcode ? String(row.barcode) : null,
      costPrice: row.costPrice
        ? parseFloat(Number(row.costPrice).toFixed(3))
        : null,
      salesPrice: row.salesPrice
        ? parseFloat(Number(row.salesPrice).toFixed(3))
        : null,
      wholesalePrice: row.wholesalePrice
        ? parseFloat(Number(row.wholesalePrice).toFixed(3))
        : null,
      isActive: row.isActive === 'TRUE' || row.isActive === true,
    }));

    // Use Prisma transaction to insert rows into the database
    const result = await this.prisma.$transaction(
      formattedRows.map((row) =>
        this.prisma.product.create({
          data: row,
        }),
      ),
    );

    console.log(`Inserted ${result.length} rows into the database`);

    return { success: true, insertedRows: result.length };
  }

  async getProducts(companyId: string) {
    const products = await this.prisma.product.findMany({
      orderBy: { name: 'asc' },
    });

    const finalProducts = products.map((product) => {
      const totalCost = product.costPrice * product.stock;
      return {
        ...product,
        totalCost: totalCost.toFixed(3),
      };
    });

    return finalProducts;
  }

  async validateAndUpdateStock(invoiceItems: any[]) {
    let totalCOGS = 0;

    await Promise.all(
      invoiceItems.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} does not exist`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ID: ${item.productId} (Available: ${product.stock}, Required: ${item.quantity})`,
          );
        }

        totalCOGS += product.costPrice * item.quantity;

        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }),
    );

    return totalCOGS;
  }
}
