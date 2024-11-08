import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './domain/refresh.token.entity';
import { AuthController } from './api/auth.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from '../../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { DevicesService } from '../securityDevices/application/devices.service';
import { AuthService } from './application/auth.service';
import { RefreshTokenRepository } from './infrastructure/sql/refrest.token.repository';
import { UserModule } from '../users/user.module';
import { DeviceModule } from '../securityDevices/device.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UserModule, DeviceModule],
  controllers: [AuthController],
  providers: [
    BcryptService,
    NodemailerService,
    JwtService,
    RefreshTokenRepository,
    DevicesService,
    AuthService,
  ],
})
export class AuthModule {}
