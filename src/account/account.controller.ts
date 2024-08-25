import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @ApiOperation({ summary: 'Create a new account' })
    @ApiResponse({ status: 201, description: 'The account has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Post()
    async create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.create(createAccountDto);
    }

    @ApiOperation({ summary: 'Retrieve all accounts' })
    @ApiResponse({ status: 200, description: 'List of accounts' })
    @Get()
    async findAll() {
        return this.accountService.findAll();
    }

    @ApiOperation({ summary: 'Retrieve a specific account by ID' })
    @ApiResponse({ status: 200, description: 'The account details' })
    @ApiResponse({ status: 404, description: 'Account not found' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.accountService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an existing account' })
    @ApiResponse({ status: 200, description: 'The account has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Account not found' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountService.update(id, updateAccountDto);
    }

    @ApiOperation({ summary: 'Delete an account' })
    @ApiResponse({ status: 200, description: 'The account has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Account not found' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.accountService.remove(id);
    }
}
