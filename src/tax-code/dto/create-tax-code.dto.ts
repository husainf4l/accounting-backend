import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxCodeDto {
    @ApiProperty({ example: 'VAT', description: 'The name of the tax code' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 0.05, description: 'The tax rate (e.g., 0.05 for 5%)' })
    @IsNumber()
    @IsNotEmpty()
    rate: number;

    @ApiProperty({ example: 'Value Added Tax', description: 'A description of the tax code', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'company-id-123', description: 'The ID of the company that owns the tax code' })
    @IsString()
    @IsNotEmpty()
    companyId: string;
}
