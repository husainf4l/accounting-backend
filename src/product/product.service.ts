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
        console.log("started", filePath);
        const mapping = {
            A: 'barcode',
            B: 'name', 
            C: 'description',
            D: 'costPrice', 
            E: 'salesPrice', 
            F:'wholesalePrice',
            G:'stock',
            H:'reorderLevel',
            I:'isActive',
            J:'origin',
            K:'taxRate'

        };
    

        const rows = await this.uploadService.processExcelFile(filePath, mapping);
    
        const formattedRows = rows.map((row) => ({
            ...row,
            barcode: row.barcode ? String(row.barcode) : null, 
            costPrice: row.costPrice ? Number(row.costPrice.toFixed(3)) : null, 
            salesPrice: row.salesPrice ? Number(row.salesPrice.toFixed(3)) : null,
            isActive: row.isActive === 'TRUE' || row.isActive === true,
        }));
    
        const result = await this.prisma.$transaction(
            formattedRows.map((row) =>
                this.prisma.product.create({
                    data: row,
                }),
            ),
        );
    
        return { success: true, insertedRows: result.length };
    }
    


      
}
