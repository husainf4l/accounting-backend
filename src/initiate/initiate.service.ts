import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InitiateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // Fetch initiate data based on userId
  async getInitiateData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }, // Include related company data
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userWithoutPassword } = user; 
    return {
      userData: userWithoutPassword,
    };
  }

  // Extract user from JWT token
  getUserFromToken(token?: string): any {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const accessToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    try {
      return this.jwtService.verify(accessToken, { secret: process.env.JWT_SECRET });
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Extract companyId from JWT token
  getCompanyId(token: string): string {
    const user = this.getUserFromToken(token);
    if (!user?.companyId) {
      throw new UnauthorizedException('Token is missing companyId');
    }
    return user.companyId;
  }
}
