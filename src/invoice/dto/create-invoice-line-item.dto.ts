import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceLineItemDto {
    @ApiProperty({ example: 'Product A', description: 'Description of the item' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 10, description: 'Quantity of the item' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 100.0, description: 'Unit price of the item' })
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty({ example: 1000.0, description: 'Total amount for the item' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: 'item-id-123', description: 'ID of the associated item (optional)', required: false })
    @IsString()
    @IsOptional()
    itemId?: string;
}
