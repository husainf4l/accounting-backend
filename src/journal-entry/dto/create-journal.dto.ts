import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateJournalDto {

    @IsString()
    code: string;

    @IsOptional()
    @IsNumber()
    debit?: number;

    @IsOptional()
    @IsNumber()
    credit?: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    currency?: string;
}
