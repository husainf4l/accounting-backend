import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email address of the user'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'P@ssw0rd!',
        description: 'The password for the user account'
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'John',
        description: 'The first name of the user'
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The last name of the user'
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;
}
