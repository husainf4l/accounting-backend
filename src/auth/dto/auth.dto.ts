import { IsString, IsNotEmpty, IsMobilePhone, MinLength } from 'class-validator';

export class SignupRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsMobilePhone()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @MinLength(1) 
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber:string

    @IsString()
    @IsNotEmpty()
    email: string;

    companyId:string
}

export class LoginRequest {
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
