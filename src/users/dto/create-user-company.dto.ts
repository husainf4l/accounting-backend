import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole, AccessLevel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserCompanyDto {
    @ApiProperty({
        example: 'user-id-123',
        description: 'The ID of the user'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: 'company-id-456',
        description: 'The ID of the company'
    })
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @ApiProperty({
        example: UserRole.ADMIN,
        description: 'The role of the user within the company',
        enum: UserRole
    })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @ApiProperty({
        example: AccessLevel.FULL_ACCESS,
        description: 'The access level of the user within the company',
        enum: AccessLevel
    })
    @IsEnum(AccessLevel)
    @IsNotEmpty()
    accessLevel: AccessLevel;

    @ApiProperty({
        example: '{"canViewReports": true, "canEditSettings": false}',
        description: 'JSON string containing custom permissions for the user within the company'
    })
    @IsString()
    permissions: string;
}
