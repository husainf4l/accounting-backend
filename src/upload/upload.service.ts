import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as ExcelJS from 'exceljs';


@Injectable()
export class UploadService {
  private readonly uploadDir = join(__dirname, '..', '..', 'uploads');

  constructor() {
    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: any): Promise<string> {
    const { filename, file: fileStream, mimetype } = file;

    if (!mimetype.startsWith('image/')) {
      throw new Error('Only image uploads are allowed');
    }

    const filePath = join(this.uploadDir, filename);

    const writeStream = fs.createWriteStream(filePath);

    try {
      for await (const chunk of fileStream) {
        writeStream.write(chunk);
      }
      writeStream.end();
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }

    return filePath;
  }

  async processExcelFile(filePath: string, mapping: Record<string, string>): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const headers = worksheet.getRow(1).values as string[];
    const dataRows: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowData = headers.reduce((acc, header, index) => {
        const key = mapping[header.trim()];
        if (key) {
          acc[key] = row.getCell(index + 1).value;
        }
        return acc;
      }, {});

      dataRows.push(rowData);
    });

    return dataRows;
  }

}
