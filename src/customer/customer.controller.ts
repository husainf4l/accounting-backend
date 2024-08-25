import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @ApiOperation({ summary: 'Create a new customer' })
    @ApiResponse({ status: 201, description: 'The customer has been successfully created.' })
    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @ApiOperation({ summary: 'Get all customers' })
    @ApiResponse({ status: 200, description: 'List of customers.' })
    @Get()
    async findAll() {
        return this.customerService.findAll();
    }

    @ApiOperation({ summary: 'Get a single customer by ID' })
    @ApiResponse({ status: 200, description: 'The customer details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.customerService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a customer' })
    @ApiResponse({ status: 200, description: 'The customer has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customerService.update(id, updateCustomerDto);
    }

    @ApiOperation({ summary: 'Delete a customer' })
    @ApiResponse({ status: 200, description: 'The customer has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.customerService.remove(id);
    }
}
