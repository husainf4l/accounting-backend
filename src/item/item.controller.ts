import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @ApiOperation({ summary: 'Create a new item' })
    @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
    @Post()
    async create(@Body() createItemDto: CreateItemDto) {
        return this.itemService.create(createItemDto);
    }

    @ApiOperation({ summary: 'Get all items' })
    @ApiResponse({ status: 200, description: 'List of items.' })
    @Get()
    async findAll() {
        return this.itemService.findAll();
    }

    @ApiOperation({ summary: 'Get a single item by ID' })
    @ApiResponse({ status: 200, description: 'The item details.' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.itemService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an item' })
    @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
        return this.itemService.update(id, updateItemDto);
    }

    @ApiOperation({ summary: 'Delete an item' })
    @ApiResponse({ status: 200, description: 'The item has been successfully deleted.' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.itemService.remove(id);
    }
}
