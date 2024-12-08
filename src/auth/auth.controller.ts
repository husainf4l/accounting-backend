import { Controller, Post, Body, UnauthorizedException, Get, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginRequest, SignupRequest } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Login method: Authenticates the user and issues an access token
    @Post('login')
    async login(@Body() req: LoginRequest) {
        const user = await this.authService.validateUser(req.userName, req.password);
        return this.authService.login(user); // Pass validated user directly to login
    }

    // Verify token method: Validates the provided JWT token
    @Get('verify-token')
    async verifyToken(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

        if (!token) {
            throw new HttpException('Token not provided', HttpStatus.BAD_REQUEST);
        }

        try {
            const decoded = await this.authService.verifyToken(token);
            return reply.status(HttpStatus.OK).send({ valid: true, decoded });
        } catch (error) {
            console.error('Token verification failed:', error);
            return reply.status(HttpStatus.UNAUTHORIZED).send({ valid: false, message: error.message });
        }
    }

    @Post('signup')
    async signup(@Body() req: SignupRequest) {
        return this.authService.signup(req);
    }
}
