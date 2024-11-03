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
import { DevicesRepository } from '../infrastructure/devices.repository';

@Controller('security/devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly devicesRepository: DevicesRepository,
  ) {}
  @Get()
  @HttpCode(200)
  async getAllDevicesWithActiveSession(@Request() req) {
    const activeSessions = await this.devicesRepository.findActiveSessions(
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
    const sessionToTerminate =
      await this.devicesService.findSessionToTerminate(deviceId);
    if (!sessionToTerminate) {
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
