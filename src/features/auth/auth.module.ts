import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenBlackList } from './domain/refresh.token.entity';
import { AuthController } from './api/auth.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from '../../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { AuthService } from './application/auth.service';
import { RefreshTokenBlackListRepo } from './infrastructure/typeorm/refresh.token.repo';
import { UserModule } from '../users/user.module';
import { DeviceModule } from '../securityDevices/device.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenBlackList]),
    UserModule,
    DeviceModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    NodemailerService,
    JwtService,
    RefreshTokenBlackListRepo,
  ],
  exports: [RefreshTokenBlackListRepo],
})
export class AuthModule {}
