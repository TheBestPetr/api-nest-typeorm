import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenBlackList } from './domain/refresh.token.entity';
import { AuthController } from './api/auth.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from '../../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { AuthService } from './application/auth.service';
import { RefreshTokenBlackListRepo } from './infrastructure/typeorm/refresh.token.repo';
import { UsersQueryRepo } from '../users/infrastructure/typeorm/users.query.repo';
import { UsersRepo } from '../users/infrastructure/typeorm/users.repo';
import { DevicesRepo } from '../securityDevices/infrastructure/typeorm/devices.repo';
import { DevicesService } from '../securityDevices/application/devices.service';
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
    UsersQueryRepo,
    BcryptService,
    UsersRepo,
    NodemailerService,
    JwtService,
    RefreshTokenBlackListRepo,
    DevicesRepo,
    DevicesService,
  ],
  exports: [RefreshTokenBlackListRepo],
})
export class AuthModule {}
