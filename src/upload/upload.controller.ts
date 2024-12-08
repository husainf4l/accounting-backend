import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async uploadFile(@Req() request: FastifyRequest): Promise<{ message: string; filePath: string }> {
    const file = await request.file();

    if (!file) {
      throw new Error('No file uploaded');
    }

    const filePath = await this.uploadService.saveFile(file);

    return { message: 'File uploaded successfully', filePath };
  }
}
