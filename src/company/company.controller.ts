import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('company')
@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @ApiOperation({ summary: 'Create a new company' })
    @ApiResponse({ status: 201, description: 'The company has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Post()
    async create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @ApiOperation({ summary: 'Retrieve all companies' })
    @ApiResponse({ status: 200, description: 'List of companies' })
    @Get()
    async findAll() {
        return this.companyService.findAll();
    }

    @ApiOperation({ summary: 'Retrieve a specific company by ID' })
    @ApiResponse({ status: 200, description: 'The company details' })
    @ApiResponse({ status: 404, description: 'Company not found' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.companyService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an existing company' })
    @ApiResponse({ status: 200, description: 'The company has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Company not found' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companyService.update(id, updateCompanyDto);
    }

    @ApiOperation({ summary: 'Delete a company' })
    @ApiResponse({ status: 200, description: 'The company has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Company not found' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.companyService.remove(id);
    }
}
