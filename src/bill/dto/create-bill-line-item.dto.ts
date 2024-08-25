import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillLineItemDto {
    @ApiProperty({ example: 'Item description', description: 'Description of the item' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 10, description: 'Quantity of the item' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 100, description: 'Unit price of the item' })
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty({ example: 'item-id-123', description: 'The ID of the item' })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({ example: 1000, description: 'Total amount for this line item (quantity * unit price)' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
