import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignupRequest } from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly secret: string;

  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET');
  }

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { userName } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const { password, ...result } = user; // Exclude password from the result
    return result;
  }

  async login(user: {
    id: string;
    role: UserRole;
    companyId: string;
    userName: string;
  }) {
    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token: token,
      user_id: user.id,
      companyId: user.companyId,
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: this.secret });
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async signup(user: SignupRequest) {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { userName: user.userName },
    });

    if (existingUser) {
      throw new HttpException(
        'User already exists with this mobile number',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userName: user.userName,
        password: hashedPassword,
        role: user.role as UserRole,
        companyId: user.companyId || null,
      },
    });

    // Return token and user_id after successful signup
    return this.login({
      id: newUser.id,
      userName: newUser.userName,
      role: newUser.role,
      companyId: newUser.companyId,
    });
  }

  // Extract user from JWT token
  getUserFromToken(token?: string): any {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const accessToken = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;

    try {
      return this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  getCompanyId(token: string): string {
    const user = this.getUserFromToken(token);
    if (!user?.companyId) {
      throw new UnauthorizedException('Token is missing companyId');
    }
    return user.companyId;
  }


  async refreshUserToken(userId: string): Promise<string> {
    // Step 1: Fetch updated user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Define the new JWT payload
    const payload = {
      sub: user.id,
      mobile: user.phoneNumber,
      role: user.role,
      companyId: user.companyId,
    };

    // Step 3: Generate a new JWT
    return this.jwtService.sign(payload);
  }


}
