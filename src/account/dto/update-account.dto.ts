import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { AccountType, AccountSubtype } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
    @ApiProperty({
        example: 'Cash Account',
        description: 'The name of the account'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: AccountType.ASSET,
        description: 'The type of the account',
        enum: AccountType
    })
    @IsEnum(AccountType)
    @IsOptional()
    type?: AccountType;

    @ApiProperty({
        example: '1001',
        description: 'The account number'
    })
    @IsString()
    @IsOptional()
    number?: string;

    @ApiProperty({
        example: 1000.50,
        description: 'The current balance of the account'
    })
    @IsNumber()
    @IsOptional()
    balance?: number;

    @ApiProperty({
        example: 5000.00,
        description: 'The opening balance of the account at the start of the fiscal year'
    })
    @IsNumber()
    @IsOptional()
    openingBalance?: number;

    @ApiProperty({
        example: 'USD',
        description: 'The currency of the account'
    })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({
        example: 'FIXED_ASSET',
        description: 'The subtype of the account (if applicable)',
        enum: AccountSubtype
    })
    @IsEnum(AccountSubtype)
    @IsOptional()
    subtype?: AccountSubtype;

    @ApiProperty({
        example: 'parent-account-id',
        description: 'The ID of the parent account if this account is a sub-account'
    })
    @IsString()
    @IsOptional()
    parentId?: string;

    @ApiProperty({
        example: 'company-id-123',
        description: 'The ID of the company to which the account belongs'
    })
    @IsString()
    @IsOptional()
    companyId?: string;
}
