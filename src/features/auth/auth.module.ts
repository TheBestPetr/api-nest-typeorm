import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './domain/refresh.token.entity';
import { AuthController } from './api/auth.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { NodemailerService } from '../../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { DevicesRepository } from '../securityDevices/infrastructure/devices.repository';
import { DevicesService } from '../securityDevices/application/devices.service';
import { AuthService } from './application/auth.service';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { RefreshTokenRepository } from './infrastructure/refrest.token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  controllers: [AuthController],
  providers: [
    BcryptService,
    UsersRepository,
    NodemailerService,
    JwtService,
    RefreshTokenRepository,
    DevicesRepository,
    DevicesService,
    AuthService,
    UsersQueryRepository,
  ],
})
export class AuthModule {}
