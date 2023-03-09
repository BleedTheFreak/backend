import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule { }
