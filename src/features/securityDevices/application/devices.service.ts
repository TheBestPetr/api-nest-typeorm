import { Injectable } from '@nestjs/common';
import { JwtService } from '../../../infrastructure/utils/services/jwt.service';
import { Device } from '../domain/device.entity';
import { DevicesRepo } from '../infrastructure/typeorm/devices.repo';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepo: DevicesRepo,
    private readonly jwtService: JwtService,
  ) {}
  async createDevice(device: Device): Promise<boolean> {
    return this.devicesRepo.createDevice(device);
  }

  async updateDeviceIatNExp(
    deviceId: string,
    oldIat: string,
    newIat: string,
    newExp: string,
  ): Promise<boolean> {
    return this.devicesRepo.updateDeviceIatNExp(
      deviceId,
      oldIat,
      newIat,
      newExp,
    );
  }

  async findSessionByDeviceId(deviceId: string): Promise<string | null> {
    return this.devicesRepo.findSessionByDeviceId(deviceId);
  }

  async isUserCanTerminateSession(
    refreshToken: string,
    deviceId: string,
  ): Promise<boolean> {
    const userId = this.jwtService.getUserIdByToken(refreshToken);
    const deviceOwnerId =
      await this.devicesRepo.findSessionByDeviceId(deviceId);
    if (userId !== deviceOwnerId) {
      return false;
    }
    return this.devicesRepo.deleteSessionByDeviceId(deviceId);
  }

  async terminateAllSessions(refreshToken: string): Promise<boolean> {
    const deviceId = this.jwtService.getDeviceIdByToken(refreshToken);
    return this.devicesRepo.deleteAllSessions(deviceId);
  }
}
