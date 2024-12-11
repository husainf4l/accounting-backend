import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseModule } from 'src/Firebase/firebase/firebase.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, FirebaseModule, PrismaModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
