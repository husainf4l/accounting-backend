import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async uploadProducts(filePath: string, companyId: string): Promise<any> {
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
      companyId: companyId,
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
      where: { companyId: companyId },
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

  async calculateCost(productId: string, quantity: number): Promise<number> {
    const movements = await this.prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' }, // For FIFO
    });

    let cost = 0;
    let remaining = quantity;

    for (const movement of movements) {
      if (remaining <= 0) break;

      const usedQuantity = Math.min(remaining, movement.quantity);
      cost += usedQuantity * movement.costPerUnit;
      remaining -= usedQuantity;
    }

    if (remaining > 0)
      throw new Error('Insufficient stock for FIFO calculation');

    return cost;
  }

  async inventory(companyId: string, startDate?: string, endDate?: string) {
    const inventory = await this.prisma.product.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  
    // Add total cost calculation
    const formattedInventory = inventory.map((item) => ({
      name: item.name,
      sku: item.barcode,
      category: item.category,
      stock: item.stock,
      costPrice: item.costPrice,
      totalCost: item.costPrice * item.stock,
      nrv: item.nrv || null, // Include NRV if applicable
      isBelowReorder: item.stock < (item.reorderLevel || 0), // Add stock alert flag
      valuationMethod: item.valuationMethod || 'FIFO', // Default to FIFO
    }));
  
    return formattedInventory;
  }
  
  
  async generateReport(companyId: string, startDate?: string, endDate?: string) {
    const inventory = await this.inventory(companyId, startDate, endDate);
  
    // Format the inventory data for the report
    const reportData = inventory.map((item) => ({
      Name: item.name,
      SKU: item.sku, // Use 'sku' as defined in the formattedInventory
      Category: item.category,
      Stock: item.stock,
      Cost: item.costPrice,
      TotalCost: (item.costPrice * item.stock).toFixed(2),
    }));
  
    return reportData;
  }
  


  async getStockAlerts(companyId: string) {
    const alerts = await this.prisma.product.findMany({
      where: {
        companyId,
        stock: {
          lt: this.prisma.product.fields.reorderLevel, // Less than reorder level
        },
      },
    });
  
    return alerts;
  }
  
  
}
