import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class TransactionTaxDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    taxCodeId: string;
}
