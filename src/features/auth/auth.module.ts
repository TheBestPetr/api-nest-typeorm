import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './domain/refresh.token.entity';
import { AuthController } from './api/auth.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { UsersRepository } from '../users/infrastructure/sql/users.repository';
import { NodemailerService } from '../../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { DevicesRepository } from '../securityDevices/infrastructure/sql/devices.repository';
import { DevicesService } from '../securityDevices/application/devices.service';
import { AuthService } from './application/auth.service';
import { UsersQueryRepository } from '../users/infrastructure/sql/users.query.repository';
import { RefreshTokenRepository } from './infrastructure/sql/refrest.token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
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
