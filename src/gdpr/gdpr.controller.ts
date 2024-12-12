import { Controller } from '@nestjs/common';
import { GdprService } from './gdpr.service';

@Controller('gdpr')
export class GdprController {
    constructor(private readonly gdprService: GdprService) { }
}

