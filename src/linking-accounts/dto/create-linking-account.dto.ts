import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateLinkingAccountDto {
    @IsString()
    @MaxLength(50)
    role: string; // Example: "Cash Account", "Trade Expense"

    @IsUUID()
    accountId: string; // ID of the account being linked

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string; // Optional description
}
