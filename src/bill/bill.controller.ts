import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('bills')
@Controller('bills')
export class BillController {
    constructor(private readonly billService: BillService) { }

    @ApiOperation({ summary: 'Create a new bill' })
    @ApiResponse({ status: 201, description: 'The bill has been successfully created.' })
    @Post()
    async create(@Body() createBillDto: CreateBillDto) {
        return this.billService.create(createBillDto);
    }

    @ApiOperation({ summary: 'Get all bills' })
    @ApiResponse({ status: 200, description: 'List of bills.' })
    @Get()
    async findAll() {
        return this.billService.findAll();
    }

    @ApiOperation({ summary: 'Get a single bill by ID' })
    @ApiResponse({ status: 200, description: 'The bill details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.billService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a bill' })
    @ApiResponse({ status: 200, description: 'The bill has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
        return this.billService.update(id, updateBillDto);
    }

    @ApiOperation({ summary: 'Delete a bill' })
    @ApiResponse({ status: 200, description: 'The bill has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.billService.remove(id);
    }
}
