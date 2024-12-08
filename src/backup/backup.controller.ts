import { Controller, Post, Req, Get, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as path from 'path';
import * as fs from 'fs-extra';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  async triggerBackup(): Promise<string> {
    await this.backupService.backupDatabase();
    return 'Backup process initiated!';
  }

  @Post('restore')
  async restoreBackup(@Req() request: FastifyRequest): Promise<{ message: string }> {
    const file = await request.file();

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!file.filename.endsWith('.sql')) {
      throw new HttpException('Only .sql files are allowed!', HttpStatus.BAD_REQUEST);
    }

    // Save the uploaded file temporarily
    const uploadDir = path.resolve(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, `restore-${Date.now()}${path.extname(file.filename)}`);

    await fs.ensureDir(uploadDir);

    const writeStream = fs.createWriteStream(filePath);

    for await (const chunk of file.file) {
      writeStream.write(chunk);
    }
    writeStream.end();

    try {
      await this.backupService.restoreDatabase(filePath);
      await fs.unlink(filePath); // Clean up the uploaded file after restoration
      return { message: 'Database restored successfully' };
    } catch (error) {
      await fs.unlink(filePath); // Ensure cleanup even if restoration fails
      throw new HttpException('Failed to restore the database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
