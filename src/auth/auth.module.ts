import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LocalStrategy } from './stratagies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratagies/jwt.stratagy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: 60 * 15 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
