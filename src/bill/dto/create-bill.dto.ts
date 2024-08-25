import { IsString, IsNumber, IsDate, IsNotEmpty, IsBoolean, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBillLineItemDto } from './create-bill-line-item.dto';

export class CreateBillDto {
    @ApiProperty({ example: 'BILL-001', description: 'Unique bill number' })
    @IsString()
    @IsNotEmpty()
    billNumber: string;

    @ApiProperty({ example: 1000, description: 'Total amount of the bill' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Due date of the bill' })
    @IsDate()
    @IsNotEmpty()
    dueDate: Date;

    @ApiProperty({ example: false, description: 'Indicates whether the bill has been paid' })
    @IsBoolean()
    @IsOptional()
    paid?: boolean;

    @ApiProperty({ example: 'USD', description: 'Currency of the bill' })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({ example: 'vendor-id-123', description: 'The vendor to which this bill belongs' })
    @IsString()
    @IsNotEmpty()
    vendorId: string;

    @ApiProperty({ example: 'company-id-123', description: 'The company to which this bill belongs' })
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @ApiProperty({ type: [CreateBillLineItemDto], description: 'Line items for the bill' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBillLineItemDto)
    lineItems: CreateBillLineItemDto[];
}
