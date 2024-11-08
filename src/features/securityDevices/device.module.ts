import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesController } from './api/devices.controller';
import { DevicesService } from './application/devices.service';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { DevicesRepo } from './infrastructure/typeorm/devices.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [JwtService, DevicesRepo, DevicesService, JwtService],
  exports: [DevicesRepo, DevicesService],
})
export class DeviceModule {}
