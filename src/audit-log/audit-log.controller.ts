import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('audit-log')
@Controller('audit-log')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @ApiOperation({ summary: 'Get all audit logs' })
    @ApiResponse({ status: 200, description: 'List of all audit logs.' })
    @Get()
    async findAll() {
        return this.auditLogService.findAll();
    }

    @ApiOperation({ summary: 'Get a single audit log by ID' })
    @ApiResponse({ status: 200, description: 'Details of a single audit log.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.auditLogService.findOne(id);
    }

    @ApiOperation({ summary: 'Get audit logs by entity type' })
    @ApiResponse({ status: 200, description: 'List of audit logs by entity type.' })
    @Get('entity/:entityType')
    async findByEntityType(@Param('entityType') entityType: string) {
        return this.auditLogService.findByEntityType(entityType);
    }

    @ApiOperation({ summary: 'Get audit logs by user' })
    @ApiResponse({ status: 200, description: 'List of audit logs by user ID.' })
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.auditLogService.findByUser(userId);
    }
}
