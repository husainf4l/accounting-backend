import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123 Main St, Anytown, USA', description: 'The address of the customer' })
    @IsString()
    @IsNotEmpty()  // Make address required
    address: string;

    @ApiProperty({ example: '+1-800-555-1234', description: 'The contact phone number of the customer' })
    @IsString()
    @IsNotEmpty()  // Make phone required
    phone: string;

    @ApiProperty({ example: 'customer@example.com', description: 'The email of the customer' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'company-id-123', description: 'The ID of the associated company' })
    @IsString()
    @IsNotEmpty()
    companyId: string;
}
