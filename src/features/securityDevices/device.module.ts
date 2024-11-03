import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesController } from './api/devices.controller';
import { DevicesRepository } from './infrastructure/devices.repository';
import { DevicesService } from './application/devices.service';
import { RefreshTokenRepository } from '../auth/infrastructure/refrest.token.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [
    RefreshTokenRepository,
    JwtService,
    DevicesRepository,
    DevicesService,
  ],
})
export class DeviceModule {}
