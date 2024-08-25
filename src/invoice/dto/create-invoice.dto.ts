import { IsString, IsNotEmpty, IsNumber, IsDate, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInvoiceLineItemDto } from './create-invoice-line-item.dto';
import { CreateInvoiceTaxDto } from './create-invoice-tax.dto';

export class CreateInvoiceDto {
    @ApiProperty({ example: 'INV-001', description: 'Unique invoice number' })
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @ApiProperty({ example: 1000.0, description: 'Total amount of the invoice' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: '2024-12-31T00:00:00.000Z', description: 'Due date of the invoice' })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dueDate: Date;

    @ApiProperty({ example: false, description: 'Whether the invoice has been paid' })
    @IsBoolean()
    @IsNotEmpty()
    paid: boolean;

    @ApiProperty({ example: 'USD', description: 'Currency of the invoice' })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({ example: 'customer-id-123', description: 'ID of the customer associated with the invoice' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ example: 'company-id-123', description: 'ID of the company associated with the invoice' })
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @ApiProperty({ example: 'user-id-123', description: 'ID of the user who created the invoice' })
    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @ApiProperty({ example: 'user-id-123', description: 'ID of the user who last updated the invoice' })
    @IsString()
    @IsNotEmpty()
    updatedBy: string;

    @ApiProperty({
        type: [CreateInvoiceLineItemDto],
        description: 'List of line items associated with the invoice',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceLineItemDto)
    lineItems: CreateInvoiceLineItemDto[];

    @ApiProperty({
        type: [CreateInvoiceTaxDto],
        description: 'List of taxes associated with the invoice',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceTaxDto)
    taxes: CreateInvoiceTaxDto[];
}
