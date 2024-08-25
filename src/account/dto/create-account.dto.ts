import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AccountType, AccountSubtype } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
    @ApiProperty({
        example: 'Cash Account',
        description: 'The name of the account'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: AccountType.ASSET,
        description: 'The type of the account',
        enum: AccountType
    })
    @IsEnum(AccountType)
    @IsNotEmpty()
    type: AccountType;

    @ApiProperty({
        example: '1001',
        description: 'The account number'
    })
    @IsString()
    @IsNotEmpty()
    number: string;

    @ApiProperty({
        example: 1000.50,
        description: 'The current balance of the account'
    })
    @IsNumber()
    balance: number;

    @ApiProperty({
        example: 5000.00,
        description: 'The opening balance of the account at the start of the fiscal year'
    })
    @IsNumber()
    @IsOptional()
    openingBalance?: number; // Optional field for opening balance

    @ApiProperty({
        example: 'USD',
        description: 'The currency of the account'
    })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({
        example: 'FIXED_ASSET',
        description: 'The subtype of the account (if applicable)',
        enum: AccountSubtype
    })
    @IsEnum(AccountSubtype)
    @IsOptional()
    subtype?: AccountSubtype; // Optional field for account subtype

    @ApiProperty({
        example: 'parent-account-id',
        description: 'The ID of the parent account if this account is a sub-account'
    })
    @IsString()
    @IsOptional()
    parentId?: string; // Optional field for parent account

    @ApiProperty({
        example: 'company-id-123',
        description: 'The ID of the company to which the account belongs'
    })
    @IsString()
    @IsNotEmpty()
    companyId: string;
}
