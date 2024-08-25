import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiResponse({ status: 201, description: 'The invoice has been successfully created.' })
    @Post()
    async create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.create(createInvoiceDto);
    }

    @ApiOperation({ summary: 'Get all invoices' })
    @ApiResponse({ status: 200, description: 'List of invoices.' })
    @Get()
    async findAll() {
        return this.invoiceService.findAll();
    }

    @ApiOperation({ summary: 'Get a single invoice by ID' })
    @ApiResponse({ status: 200, description: 'The invoice details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.invoiceService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an invoice' })
    @ApiResponse({ status: 200, description: 'The invoice has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
        return this.invoiceService.update(id, updateInvoiceDto);
    }

    @ApiOperation({ summary: 'Delete an invoice' })
    @ApiResponse({ status: 200, description: 'The invoice has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.invoiceService.remove(id);
    }
}
