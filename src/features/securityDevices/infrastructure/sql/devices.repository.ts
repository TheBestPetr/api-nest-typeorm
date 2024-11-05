import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtService } from '../../../../infrastructure/utils/services/jwt.service';
import { Device } from '../../domain/device.entity';
import { DeviceOutputDto } from '../../api/dto/output/device.output.dto';
import { RefreshTokenRepository } from '../../../auth/infrastructure/sql/refrest.token.repository';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}
  async create(input: Device): Promise<boolean> {
    const result = await this.dataSource.query(`
        INSERT INTO public."securityDevices"(
            "userId", 
            "deviceId", 
            "iat", 
            "deviceName", 
            "ip", 
            "exp"
        )
            VALUES (
                '${input.userId}', 
                '${input.deviceId}', 
                '${input.iat}', 
                '${input.deviceName}', 
                '${input.ip}', 
                '${input.exp}');
            `);
    return !!result;
  }

  async updateIatNExp(
    deviceId: string,
    oldIat: string,
    iat: string,
    exp: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(`
        UPDATE public."securityDevices"
            SET iat = '${iat}', 
                exp = '${exp}'
            WHERE "deviceId" = '${deviceId}' AND 
                  "iat" = '${oldIat}';
            `);
    return !!result;
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
    const result = await this.dataSource.query(`
        DELETE FROM public."securityDevices"
            WHERE "deviceId" = '${deviceId}';`);
    return !!result;
  }

  async deleteAllSessions(deviceId: string): Promise<boolean> {
    const result = await this.dataSource.query(`
        DELETE FROM public."securityDevices"
            WHERE "deviceId" != '${deviceId}';`);
    return !!result;
  }

  async findActiveSessions(
    refreshToken: string,
  ): Promise<DeviceOutputDto[] | null> {
    const isTokenInBlackList =
      await this.refreshTokenRepository.isTokenInBlacklist(refreshToken);
    const userId = await this.jwtService.getUserIdByToken(refreshToken);
    if (!userId) {
      return null;
    }
    const activeSessions = await this.dataSource.query(`
        SELECT 
            "userId", 
            "deviceId",
            "iat", 
            "deviceName", 
            "ip", 
            "exp"
            FROM public."securityDevices"
            WHERE "userId" = '${userId}'`);
    if (!activeSessions || isTokenInBlackList) {
      return null;
    }
    return activeSessions.map((device) => ({
      ip: device.ip,
      title: device.deviceName,
      lastActiveDate: device.iat,
      deviceId: device.deviceId,
    }));
  }

  async findSessionByDeviceId(deviceId: string): Promise<string | null> {
    if (!deviceId) {
      return null;
    }
    const session = await this.dataSource.query(`
        SELECT 
            "userId", 
            "deviceId", 
            iat, 
            "deviceName", 
            ip, 
            exp
            FROM public."securityDevices"
            WHERE "deviceId" = '${deviceId}'`);
    if (session.length > 0) {
      return session[0].userId;
    }
    return null;
  }
}
