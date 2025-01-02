import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsISO8601,
} from 'class-validator';

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

  @IsOptional()
  @IsISO8601()
  date?: string;
}
