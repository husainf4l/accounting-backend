import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkingAccountDto } from './create-linking-account.dto';

export class UpdateLinkingAccountDto extends PartialType(CreateLinkingAccountDto) { }
