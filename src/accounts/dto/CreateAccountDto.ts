import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  ValidateNested,
  isString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType } from '@prisma/client';

export class BankDetailsDto {
    @IsString()
    accountId: string;
  
    @IsString()
    bankName: string;
  
    @IsString()
    companyId: string;
  
    @IsString()
    accountNumber: string;
  
    @IsOptional()
    @IsString()
    iban?: string;
  
    @IsOptional()
    @IsString()
    swiftCode?: string;
  
    @IsOptional()
    @IsString()
    branchName?: string;
  
    @IsBoolean()
    isActive: boolean;
  }

export class CustomerDetailsDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  companyId :string
}

export class CreateAccountDto {
  @IsString()
  hierarchyCode: string;

  @IsString()
  name: string;

  @IsString()
  @IsEnum(AccountType, { message: 'accountType must be a valid AccountType enum value' })
  accountType: AccountType;


  @IsOptional()
  @IsUUID()
  parentAccountId?: string | null;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;


  @IsString()
  companyId: string;

  @IsNumber()
  currentBalance: number;

  @IsBoolean()
  mainAccount: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails?: BankDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customerDetails?: CustomerDetailsDto;
}