import { Controller, Get, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InitiateService } from './initiate.service';

@Controller('initiate')
export class InitiateController {
  constructor(private readonly initiateService: InitiateService) { }


  @Get()
  async getInitiateData(@Headers('authorization') authHeader: string) {

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const user = this.initiateService.getUserFromToken(authHeader);

    return this.initiateService.getInitiateData(user.sub);
  }

}
