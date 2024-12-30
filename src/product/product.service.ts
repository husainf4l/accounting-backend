import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { MovementType, Product } from '@prisma/client';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

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
    // Fetch products with related movements
    const inventory = await this.prisma.product.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        InventoryMovement: true, // Include related movements from inventoryMovements table
      },
    });

    // Add total cost calculation and ensure all fields are present
    const formattedInventory = inventory.map((item) => ({
      name: item.name,
      sku: item.barcode || null, // Ensure null for missing values
      category: item.category || null,
      stock: item.stock || 0,
      costPrice: item.costPrice || 0,
      totalCost: (item.costPrice || 0) * (item.stock || 0),
      nrv: item.nrv || null, // Include NRV if applicable
      isBelowReorder: item.stock < (item.reorderLevel || 0),
      valuationMethod: item.valuationMethod || 'FIFO',
      movements: item.InventoryMovement || [], // Ensure movements is an array
    }));

    return formattedInventory;
  }

  async generateReport(
    companyId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any[]> {
    // Fetch inventory including movements
    const inventory = await this.inventory(companyId, startDate, endDate);

    const reportData = inventory.map((item) => {
      // Ensure movements is an array
      const movements = Array.isArray(item.movements) ? item.movements : [];

      // Calculate opening balance (before startDate)
      const openingBalance = movements.reduce((acc, movement) => {
        if (
          new Date(movement.createdAt) < new Date(startDate || '1970-01-01')
        ) {
          acc += movement.quantity;
        }
        return acc;
      }, 0);

      // Filter transactions within the report date range
      const transactions = movements.filter((movement) => {
        const movementDate = new Date(movement.createdAt);
        return (
          (!startDate || movementDate >= new Date(startDate)) &&
          (!endDate || movementDate <= new Date(endDate))
        );
      });

      // Calculate total in and total out within the report range
      const totalIn = transactions.reduce(
        (acc, movement) =>
          movement.type === 'IN' ? acc + movement.quantity : acc,
        0,
      );
      const totalOut = transactions.reduce(
        (acc, movement) =>
          movement.type === 'OUT' ? acc + movement.quantity : acc,
        0,
      );

      // Closing balance
      const closingBalance = openingBalance + totalIn - totalOut;

      // Total cost based on FIFO valuation
      const totalCost = this.calculateFIFO(movements, closingBalance);

      return {
        Name: item.name || 'Unnamed Item',
        SKU: item.sku || 'N/A',
        Category: item.category || 'Uncategorized',
        OpeningBalance: openingBalance,
        TotalIn: totalIn,
        TotalOut: totalOut,
        ClosingBalance: closingBalance,
        CostPerUnit: (totalCost / closingBalance || 0).toFixed(2),
        TotalCost: totalCost.toFixed(2),
        ValuationMethod: item.valuationMethod || 'FIFO',
        COGS: this.calculateCOGS(movements, totalOut).toFixed(2),
      };
    });

    return reportData;
  }

  private calculateFIFO(movements: any[], closingBalance: number): number {
    let remainingBalance = closingBalance;
    let totalCost = 0;

    for (const movement of movements) {
      if (movement.type === 'IN') {
        const usedQuantity = Math.min(remainingBalance, movement.quantity);
        totalCost += usedQuantity * movement.costPerUnit;
        remainingBalance -= usedQuantity;
        if (remainingBalance <= 0) break;
      }
    }

    return totalCost;
  }

  private calculateCOGS(movements: any[], totalOut: number): number {
    let remainingOut = totalOut;
    let cogs = 0;

    for (const movement of movements) {
      if (movement.type === 'OUT' && remainingOut > 0) {
        const usedQuantity = Math.min(remainingOut, movement.quantity);
        cogs += usedQuantity * movement.costPerUnit;
        remainingOut -= usedQuantity;
      }
    }

    return cogs;
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

  async createProduct(createProductDto: CreateProductDto) {
    const {
      barcode,
      name,
      companyId,
      description,
      costPrice,
      salesPrice,
      wholesalePrice,
      avgPrice,
      stock,
      reorderLevel,
      origin,
      family,
      subFamily,
      taxRate = 0.16,
      discountRate = 0.0,
      profitMargin,
      location,
      packaging,
      category,
      nrv,
      itemType,
      imageUrl,
    } = createProductDto;

    return await this.prisma.product.create({
      data: {
        barcode,
        name,
        companyId,
        description,
        costPrice,
        salesPrice,
        wholesalePrice,
        avgPrice,
        stock,
        reorderLevel,
        origin,
        family,
        subFamily,
        taxRate,
        discountRate,
        profitMargin,
        location,
        packaging,
        category,
        nrv,
        itemType,
        imageUrl,
      },
    });
  }

  async createProducts(createProductDtos: CreateProductDto[]) {
    const transformedData = createProductDtos.map((product) => ({
      ...product,
      costPrice: parseFloat(product.costPrice?.toString() || '0'), // Ensure it's a number
      salesPrice: parseFloat(product.salesPrice?.toString() || '0'), // Ensure it's a number
      wholesalePrice: parseFloat(product.wholesalePrice?.toString() || '0'), // Ensure it's a number
      stock: parseInt(product.stock?.toString() || '0', 10), // Ensure it's an integer
      isActive:
        typeof product.isActive === 'string'
          ? product.isActive.toLowerCase().trim() === 'true' // Safely handle strings
          : Boolean(product.isActive), // Ensure a boolean value
    }));

    return await this.prisma.product.createMany({
      data: transformedData,
      skipDuplicates: true,
    });
  }








  async updateInventory(
    updates: UpdateInventoryDto[],
    companyId: string,
  ): Promise<void> {
    for (const update of updates) {
      // Find product by SKU and companyId
      const product = await this.findBySKU(update.sku, companyId);
      if (!product) {
        throw new NotFoundException(
          `Product with SKU ${update.sku} not found for company ID ${companyId}`,
        );
      }

      // Validate FIFO layers
      if (!update.fifoLayers || update.fifoLayers.length === 0) {
        throw new BadRequestException(
          `Invalid FIFO layers for product with SKU ${update.sku}`,
        );
      }

      // Calculate total cost using FIFO layers
      const totalCost = this.calculateTotalCost(update.fifoLayers);

      // Update product
      await this.updateProduct(product, companyId, update.updatedQuantity, totalCost);
    }
  }
  async logInventoryMovement(
    productId: string,
    companyId: string,
    type: string,
    quantity: number,
    costPerUnit: number,
  ): Promise<void> {
    await this.prisma.inventoryMovement.create({
      data: {
        productId,
        companyId,
        type: MovementType.IN, // Use the enum directly
        quantity,
        costPerUnit,
      },
    });
  }
  
  async findBySKU(sku: string, companyId: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { barcode: sku, companyId },
    });
  }

  async updateProduct(
    product: Product,
    companyId: string,
    updatedQuantity: number,
    totalCost: number,
  ): Promise<Product> {
    // Update product stock and cost price
    return this.prisma.product.update({
      where: { id: product.id },
      data: {
        stock: updatedQuantity,
        costPrice: totalCost / updatedQuantity,
      },
    });
  }

  private calculateTotalCost(fifoLayers: { quantity: number; costPerUnit: number }[]): number {
    return fifoLayers.reduce((sum, layer) => sum + layer.quantity * layer.costPerUnit, 0);
  }

  async getProducts(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

}
