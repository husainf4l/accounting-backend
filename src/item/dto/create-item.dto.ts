import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
    @ApiProperty({ example: 'Product A', description: 'The name of the item' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'A description of Product A', description: 'The description of the item', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 100.00, description: 'The unit price of the item' })
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty({ example: 50, description: 'The quantity on hand' })
    @IsInt()
    @IsNotEmpty()
    quantityOnHand: number;

    @ApiProperty({ example: 'SKU12345', description: 'The SKU of the item' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 'company-id-123', description: 'The ID of the company that owns the item' })
    @IsString()
    @IsNotEmpty()
    companyId: string;
}
