import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class TransactionLineItemDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsBoolean()
    @IsNotEmpty()
    debit: boolean;  // true for debit, false for credit

    @IsString()
    @IsNotEmpty()
    accountId: string;
}
