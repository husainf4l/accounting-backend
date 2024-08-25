import { IsString, IsDate, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({
        example: 'Acme Corporation',
        description: 'The name of the company'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '123 Main St, Anytown, USA',
        description: 'The physical address of the company'
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        example: '+1-800-555-1234',
        description: 'The contact phone number of the company'
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: 'info@acme.com',
        description: 'The contact email address of the company'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456789',
        description: 'The tax identification number of the company'
    })
    @IsString()
    @IsNotEmpty()
    taxId: string;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'The start date of the fiscal year'
    })
    @IsDate()
    @IsNotEmpty()
    fiscalYearStart: Date;

    @ApiProperty({
        example: '2024-12-31T00:00:00.000Z',
        description: 'The end date of the fiscal year'
    })
    @IsDate()
    @IsNotEmpty()
    fiscalYearEnd: Date;  // Add this line

    @ApiProperty({
        example: 'USD',
        description: 'The default currency for the company'
    })
    @IsString()
    @IsNotEmpty()
    currency: string;
}
