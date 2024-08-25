import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @ApiOperation({ summary: 'Create a new transaction' })
    @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.create(createTransactionDto);
    }

    @ApiOperation({ summary: 'Get all transactions' })
    @ApiResponse({ status: 200, description: 'List of transactions.' })
    @Get()
    async findAll() {
        return this.transactionService.findAll();
    }

    @ApiOperation({ summary: 'Get a single transaction by ID' })
    @ApiResponse({ status: 200, description: 'The transaction details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.transactionService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a transaction' })
    @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTransactionDto: CreateTransactionDto) {
        return this.transactionService.update(id, updateTransactionDto);
    }

    @ApiOperation({ summary: 'Delete a transaction' })
    @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.transactionService.remove(id);
    }
}
