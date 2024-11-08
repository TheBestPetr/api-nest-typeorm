import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesController } from './api/devices.controller';
import { DevicesService } from './application/devices.service';
import { RefreshTokenRepository } from '../auth/infrastructure/sql/refrest.token.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { DevicesRepo } from './infrastructure/typeorm/devices.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [RefreshTokenRepository, JwtService, DevicesRepo, DevicesService],
  exports: [DevicesRepo],
})
export class DeviceModule {}
