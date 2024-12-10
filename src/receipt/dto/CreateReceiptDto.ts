import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
}

export class CreateReceiptDto {
  @IsNumber()
  receiptNumber: number;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  accountManagerId?: string;

  @IsOptional()
  @IsString()
  TransactionAccountId: string;

  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChequeDto)
  cheques: ChequeDto[];

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

class ChequeDto {
  @IsString()
  chequeNumber: string;

  @IsString()
  bankName: string;

  @IsNumber()
  amount: number;

  @IsString()
  date: string;
}
