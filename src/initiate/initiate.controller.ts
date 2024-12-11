import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InitiateService } from './initiate.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('initiate')
export class InitiateController {
  constructor(
    private readonly initiateService: InitiateService,
    private authService: AuthService,
  ) {}

  @Get()
  async getInitiateData(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const user = this.authService.getUserFromToken(authHeader);

    return this.initiateService.getInitiateData(user.sub);
  }
}
