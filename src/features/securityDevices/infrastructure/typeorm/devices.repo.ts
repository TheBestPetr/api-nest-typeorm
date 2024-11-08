import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Device } from '../../domain/device.entity';
import { DeviceOutputDto } from '../../api/dto/output/device.output.dto';
import { JwtService } from '../../../../infrastructure/utils/services/jwt.service';
import { RefreshTokenBlackListRepo } from '../../../auth/infrastructure/typeorm/refresh.token.repo';

@Injectable()
export class DevicesRepo {
  constructor(
    @InjectRepository(Device) private readonly devicesRepo: Repository<Device>,
    private readonly refreshTokenBlackListRepo: RefreshTokenBlackListRepo,
    private readonly jwtService: JwtService,
  ) {}

  async createDevice(device: Device): Promise<boolean> {
    const result = await this.devicesRepo.insert(device);
    return !!result;
  }

  async updateDeviceIatNExp(
    deviceId: string,
    oldIat: string,
    newIat: string,
    newExp: string,
  ): Promise<boolean> {
    const result = await this.devicesRepo.update(
      { deviceId: deviceId, iat: oldIat },
      { iat: newIat, exp: newExp },
    );
    return !!result;
  }

  async findSessionByDeviceId(deviceId: string): Promise<string | null> {
    const session = await this.devicesRepo.findOneBy({ deviceId: deviceId });
    return session?.userId || null;
  }

  async findAllActiveSessions(
    refreshToken: string,
  ): Promise<DeviceOutputDto[] | null> {
    const isTokenInBlackList =
      await this.refreshTokenBlackListRepo.isTokenInBlacklist(refreshToken);
    const userId = await this.jwtService.getUserIdByToken(refreshToken);
    if (!userId || isTokenInBlackList) {
      return null;
    }
    const activeSessions = await this.devicesRepo.findBy({ userId: userId });
    return activeSessions.map((device) => ({
      ip: device.ip,
      title: device.deviceName,
      lastActiveDate: device.iat,
      deviceId: device.deviceId,
    }));
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
    const isSessionDelete = await this.devicesRepo.delete({
      deviceId: deviceId,
    });
    return isSessionDelete.affected === 1;
  }

  async deleteAllSessions(deviceId: string): Promise<boolean> {
    await this.devicesRepo.delete({
      deviceId: Not(deviceId),
    });
    return true;
  }
}
