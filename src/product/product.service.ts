import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { MovementType, Product } from '@prisma/client';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly journalEntryService: JournalEntryService, // Inject JournalEntryService

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

  // async generateReport(companyId: string, startDate?: string, endDate?: string): Promise<any[]> {
  //   const inventory = await this.inventory(companyId, startDate, endDate);

  //   return inventory.map((item) => ({
  //     Name: item.name,
  //     SKU: item.sku,
  //     Category: item.category,
  //     OpeningBalance: item.openingBalance,
  //     TotalIn: item.totalIn,
  //     TotalOut: item.totalOut,
  //     ClosingBalance: item.closingBalance,
  //     AvailableStock: item.availableStock,
  //     CostPerUnit: item.costPerUnit,
  //     TotalCost: item.totalCost,
  //     ValuationMethod: item.valuationMethod,
  //   }));
  // }

  // async generateReport(
  //   companyId: string,
  //   startDate?: string,
  //   endDate?: string,
  // ): Promise<any[]> {
  //   const inventory = await this.inventory(companyId, startDate, endDate);

  //   return inventory.map((item) => ({
  //     Name: item.name,
  //     SKU: item.sku,
  //     Category: item.category,
  //     OpeningBalance: item.openingBalance,
  //     TotalIn: item.totalIn,
  //     TotalOut: item.totalOut,
  //     ClosingBalance: item.closingBalance,
  //     AvailableStock: item.availableStock,
  //     CostPerUnit: item.costPerUnit,
  //     TotalCost: item.totalCost,
  //     ValuationMethod: item.valuationMethod,
  //   }));
  // }

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

  async createProduct(createProductDto: CreateProductDto, companyId: string) {
    const {
      barcode,
      name,
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
        companyId: companyId,
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

  async createProducts(createProductDtos: CreateProductDto[], companyId) {
    const transformedData = createProductDtos.map((product) => ({
      ...product,
      companyId: companyId,
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

  private calculateTotalCost(
    fifoLayers: { quantity: number; costPerUnit: number }[],
  ): number {
    return fifoLayers.reduce(
      (sum, layer) => sum + layer.quantity * layer.costPerUnit,
      0,
    );
  }

  async getProducts(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async logInventoryMovement(
    productId: string,
    companyId: string,
    type: MovementType,
    quantity: number,
    costPerUnit: number,
  ): Promise<void> {
    if (quantity <= 0 || costPerUnit <= 0) {
      throw new BadRequestException(
        `Invalid inventory movement data for product ID ${productId}.`,
      );
    }

    const totalCost = quantity * costPerUnit;

    // Log the inventory movement
    await this.prisma.inventoryMovement.create({
      data: {
        productId,
        companyId,
        type,
        quantity,
        costPerUnit,
      },
    });

    // Get linked accounts
    const linkedAccounts = await this.prisma.linkedAccount.findMany({
      where: {
        companyId,
        role: { in: ['Inventory', 'Opening Balance Equity'] },
      },
      include: { account: true },
    });

    const inventoryAccount = linkedAccounts.find(
      (linked) => linked.role === 'Inventory',
    )?.account;

    const openingBalanceAccount = linkedAccounts.find(
      (linked) => linked.role === 'Opening Balance Equity',
    )?.account;

    if (!inventoryAccount || !openingBalanceAccount) {
      throw new NotFoundException(
        'Required linked accounts (Inventory or Opening Balance Equity) are missing.',
      );
    }

    // Prepare journal entry data
    const journalData = {
      date: new Date(),
      transactions: [
        {
          accountId: inventoryAccount.id,
          debit: type === 'IN' ? totalCost : null,
          credit: type === 'OUT' ? totalCost : null,
          companyId,
        },
        {
          accountId: openingBalanceAccount.id,
          debit: type === 'OUT' ? totalCost : null,
          credit: type === 'IN' ? totalCost : null,
          companyId,
        },
      ],
    };

    // Use JournalEntryService to log journal entry
    await this.journalEntryService.createJournalEntry(companyId, journalData);
  }


  async updateInventory(
    updates: UpdateInventoryDto[],
    companyId: string,
  ): Promise<void> {
    for (const update of updates) {
      const product = await this.findBySKU(update.sku, companyId);
      if (!product) {
        throw new NotFoundException(
          `Product with SKU ${update.sku} not found.`,
        );
      }

      if (!update.fifoLayers || update.fifoLayers.length === 0) {
        throw new BadRequestException(
          `FIFO layers are required for SKU ${update.sku}.`,
        );
      }

      const totalCost = update.fifoLayers.reduce(
        (sum, layer) => sum + layer.quantity * layer.costPerUnit,
        0,
      );

      // Update the product stock and cost price
      await this.updateProduct(
        product,
        companyId,
        update.updatedQuantity,
        totalCost,
      );

      // Log inventory movements and corresponding journal entries
      for (const layer of update.fifoLayers) {
        await this.logInventoryMovement(
          product.id,
          companyId,
          'IN',
          layer.quantity,
          layer.costPerUnit,
        );
      }
    }
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
    if (updatedQuantity <= 0) {
      throw new BadRequestException(
        `Updated quantity must be greater than zero for product ${product.barcode}.`,
      );
    }

    const newCostPrice = totalCost / updatedQuantity;

    return this.prisma.product.update({
      where: { id: product.id },
      data: {
        stock: updatedQuantity,
        costPrice: parseFloat(newCostPrice.toFixed(2)),
      },
    });
  }

  async inventory(
    companyId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any[]> {
    const start = startDate
      ? new Date(startDate)
      : new Date('1970-01-01T00:00:00.000Z');
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    const inventory = await this.prisma.product.findMany({
      where: { companyId },
      include: { InventoryMovement: true },
    });

    return inventory.map((item) => {
      const movements = item.InventoryMovement || [];

      const openingBalance = movements
        .filter(
          (movement) =>
            new Date(movement.createdAt) < start && movement.type === 'IN',
        )
        .reduce((sum, movement) => sum + movement.quantity, 0);

      const totalIn = movements
        .filter(
          (movement) =>
            new Date(movement.createdAt) >= start &&
            new Date(movement.createdAt) <= end &&
            movement.type === 'IN',
        )
        .reduce((sum, movement) => sum + movement.quantity, 0);

      const totalOut = movements
        .filter(
          (movement) =>
            new Date(movement.createdAt) >= start &&
            new Date(movement.createdAt) <= end &&
            movement.type === 'OUT',
        )
        .reduce((sum, movement) => sum + movement.quantity, 0);

      const closingBalance = openingBalance + totalIn - totalOut;
      const availableStock = closingBalance;

      return {
        name: item.name || 'Unnamed Product',
        sku: item.barcode || 'N/A',
        category: item.category || 'N/A',
        openingBalance,
        totalIn,
        totalOut,
        closingBalance,
        availableStock,
        costPerUnit: (item.costPrice || 0).toFixed(2),
        totalCost: (availableStock * (item.costPrice || 0)).toFixed(2),
        valuationMethod: item.valuationMethod || 'FIFO',
      };
    });
  }
}
