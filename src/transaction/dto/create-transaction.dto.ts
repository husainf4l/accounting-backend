import { IsString, IsArray, ValidateNested, IsDate, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionLineItemDto } from './transaction-line-item.dto';
import { TransactionTaxDto } from './transaction-tax.dto';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    accountId?: string;

    @IsString()
    @IsNotEmpty()
    companyId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionLineItemDto)
    lineItems: TransactionLineItemDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionTaxDto)
    taxes: TransactionTaxDto[];

    @IsString()
    @IsOptional()
    exchangeRateId?: string;

    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @IsString()
    @IsOptional()
    updatedBy?: string;
}
