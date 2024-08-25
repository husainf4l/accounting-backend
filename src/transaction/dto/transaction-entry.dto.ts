import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

enum EntryType {
    DEBIT = 'debit',
    CREDIT = 'credit',
}

export class TransactionEntryDto {
    @IsString()
    @IsNotEmpty()
    accountCode: string;  // The account involved in the transaction

    @IsNumber()
    @IsNotEmpty()
    amount: number;  // The amount of the transaction entry

    @IsEnum(EntryType)
    @IsNotEmpty()
    entryType: EntryType;  // Debit or Credit
}
