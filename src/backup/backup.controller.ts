import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { BackupService } from './backup.service';
import { Express } from 'express';



@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) { }

    @Get()
    async triggerBackup(): Promise<string> {
        await this.backupService.backupDatabase();
        return 'Backup process initiated!';
    }


    @Post('restore')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: path.resolve(__dirname, '../../uploads'),
                filename: (req, file, cb) => {
                    const fileName = `restore-${Date.now()}${path.extname(file.originalname)}`;
                    cb(null, fileName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.endsWith('.sql')) {
                    return cb(new HttpException('Only .sql files are allowed!', HttpStatus.BAD_REQUEST), false);
                }
                cb(null, true);
            },
        }),
    )
    async restoreBackup(@UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        const filePath = file.path;

        try {
            await this.backupService.restoreDatabase(filePath);
            await fs.unlink(filePath); // Clean up the uploaded file after restoration
            return { message: 'Database restored successfully' };
        } catch (error) {
            await fs.unlink(filePath); // Ensure file cleanup even if restoration fails
            throw new HttpException('Failed to restore the database', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
