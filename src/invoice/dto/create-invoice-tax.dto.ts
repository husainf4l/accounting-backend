import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceTaxDto {
    @ApiProperty({ example: 'tax-code-id-123', description: 'ID of the tax code applied to the invoice' })
    @IsString()
    @IsNotEmpty()
    taxCodeId: string;

    @ApiProperty({ example: 50.0, description: 'Amount of tax applied' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
