import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { DevicesService } from '../application/devices.service';
import { DevicesRepo } from '../infrastructure/typeorm/devices.repo';

@Controller('security/devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly devicesRepo: DevicesRepo,
  ) {}
  @Get()
  @HttpCode(200)
  async getAllDevicesWithActiveSession(@Request() req) {
    const activeSessions = await this.devicesRepo.findAllActiveSessions(
      req.cookies.refreshToken,
    );
    if (!activeSessions) {
      throw new UnauthorizedException();
    }
    return activeSessions;
  }

  @Delete()
  @HttpCode(204)
  async terminateAllDevicesSession(@Request() req) {
    if (!req.cookies.refreshToken) {
      throw new UnauthorizedException();
    }
    const isSessionsTerminated = await this.devicesService.terminateAllSessions(
      req.cookies.refreshToken,
    );
    if (!isSessionsTerminated) {
      throw new NotFoundException();
    }
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async terminateSpecifiedDeviceSession(
    @Request() req,
    @Param('deviceId') deviceId: string,
  ) {
    if (!deviceId) {
      throw new NotFoundException();
    }
    const session = await this.devicesService.findSessionByDeviceId(deviceId);
    if (!session) {
      throw new NotFoundException();
    }
    if (!req.cookies.refreshToken) {
      throw new UnauthorizedException();
    }
    const isUserCanTerminateSession =
      await this.devicesService.isUserCanTerminateSession(
        req.cookies.refreshToken,
        deviceId,
      );
    if (!isUserCanTerminateSession) {
      throw new ForbiddenException();
    }
  }
}
