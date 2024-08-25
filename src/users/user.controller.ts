import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Retrieve a specific user by ID' })
    @ApiResponse({ status: 200, description: 'The user details' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an existing user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @ApiOperation({ summary: 'Assign a user to a company' })
    @ApiResponse({ status: 201, description: 'The user has been successfully assigned to the company.' })
    @ApiResponse({ status: 400, description: 'Invalid input, object invalid.' })
    @Post('assign-company')
    async assignCompany(@Body() createUserCompanyDto: CreateUserCompanyDto) {
        return this.userService.assignCompany(createUserCompanyDto);
    }

    @ApiOperation({ summary: 'Retrieve all companies a user is assigned to' })
    @ApiResponse({ status: 200, description: 'List of companies the user is assigned to' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':id/companies')
    async findUserCompanies(@Param('id') id: string) {
        return this.userService.findUserCompanies(id);
    }
}
