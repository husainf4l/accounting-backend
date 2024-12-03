import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async processExcelFile(filePath: string, mapping: Record<string, string>): Promise<any[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet

      const rows = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip the header row
        const record = {};
        Object.keys(mapping).forEach((key) => {
          const columnIndex = worksheet.getColumn(key)?.number;
          if (columnIndex) {
            record[mapping[key]] = row.getCell(columnIndex).value;
          }
        });
        rows.push(record);
      });

      if (!rows.length) {
        throw new BadRequestException('No valid rows found in the uploaded file.');
      }

      return rows; // Return rows for further processing
    } catch (error) {
      console.error('Error processing the Excel file:', error);
      throw new BadRequestException('Failed to process the uploaded Excel file.');
    }
  }
}
