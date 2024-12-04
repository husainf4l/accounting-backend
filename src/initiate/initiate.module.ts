import { Module } from '@nestjs/common';
import { InitiateController } from './initiate.controller';
import { InitiateService } from './initiate.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [InitiateController],
  providers: [InitiateService]
})
export class InitiateModule {}
