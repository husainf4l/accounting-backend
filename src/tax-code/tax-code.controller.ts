import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaxCodeService } from './tax-code.service';
import { CreateTaxCodeDto } from './dto/create-tax-code.dto';
import { UpdateTaxCodeDto } from './dto/update-tax-code.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tax-codes')
@Controller('tax-codes')
export class TaxCodeController {
    constructor(private readonly taxCodeService: TaxCodeService) { }

    @ApiOperation({ summary: 'Create a new tax code' })
    @ApiResponse({ status: 201, description: 'The tax code has been successfully created.' })
    @Post()
    async create(@Body() createTaxCodeDto: CreateTaxCodeDto) {
        return this.taxCodeService.create(createTaxCodeDto);
    }

    @ApiOperation({ summary: 'Get all tax codes' })
    @ApiResponse({ status: 200, description: 'List of tax codes.' })
    @Get()
    async findAll() {
        return this.taxCodeService.findAll();
    }

    @ApiOperation({ summary: 'Get a single tax code by ID' })
    @ApiResponse({ status: 200, description: 'The tax code details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.taxCodeService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a tax code' })
    @ApiResponse({ status: 200, description: 'The tax code has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaxCodeDto: UpdateTaxCodeDto) {
        return this.taxCodeService.update(id, updateTaxCodeDto);
    }

    @ApiOperation({ summary: 'Delete a tax code' })
    @ApiResponse({ status: 200, description: 'The tax code has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.taxCodeService.remove(id);
    }
}
