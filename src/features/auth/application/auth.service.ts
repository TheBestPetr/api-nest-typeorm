import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../../users/api/dto/input/user.input.dto';
import {
  UserEmailConfirmation,
  UserPasswordRecovery,
  User,
} from '../../users/domain/user.entity';
import { add } from 'date-fns';
import { BcryptService } from '../../../infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from '../../../infrastructure/utils/services/nodemailer.service';
import { randomUUID } from 'node:crypto';
import { JwtService } from '../../../infrastructure/utils/services/jwt.service';
import { AuthInputLoginDto } from '../api/dto/input/auth.input.dto';
import { TokensType } from '../../../base/types/tokens.type';
import { DevicesService } from '../../securityDevices/application/devices.service';
import { Device } from '../../securityDevices/domain/device.entity';
import { UsersRepo } from '../../users/infrastructure/typeorm/users.repo';
import { DevicesRepo } from '../../securityDevices/infrastructure/typeorm/devices.repo';
import { RefreshTokenBlackListRepo } from '../infrastructure/typeorm/refresh.token.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersRepo: UsersRepo,
    private readonly nodemailerService: NodemailerService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenBlackListRepo: RefreshTokenBlackListRepo,
    private readonly devicesRepo: DevicesRepo,
    private readonly devicesService: DevicesService,
  ) {}
  async checkCredentials(input: AuthInputLoginDto): Promise<string | null> {
    const user = await this.usersRepo.findUserByLoginOrEmail(
      input.loginOrEmail,
    );
    if (user) {
      const isPassCorrect = await this.bcryptService.checkPassword(
        input.password,
        user.passwordHash,
      );
      if (isPassCorrect) {
        return user.id;
      }
    }
    return null;
  }

  async userRegistration(input: UserInputDto): Promise<boolean> {
    const passwordHash = await this.bcryptService.genHash(input.password);
    const expDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    }).toISOString();
    const createdUser = new User();
    createdUser.login = input.login;
    createdUser.passwordHash = passwordHash;
    createdUser.email = input.email;

    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.confirmationCode = randomUUID().toString();
    userEmailConfirmation.expirationDate = expDate;
    userEmailConfirmation.isConfirmed = false;

    await this.usersRepo.createUser(createdUser, userEmailConfirmation);

    this.nodemailerService
      .sendRegistrationEmail(
        createdUser.email,
        'User registration code',
        userEmailConfirmation.confirmationCode,
      )
      .catch((error) => {
        console.error('Send email error', error);
      });
    return true;
  }

  async loginUser(
    userId: string,
    ip: string,
    deviceName: string,
  ): Promise<TokensType> {
    const newDeviceId = randomUUID().toString();
    const accessToken = this.jwtService.createAccessJWTToken(userId);
    const refreshToken = this.jwtService.createRefreshJWTToken(
      userId,
      newDeviceId,
    );
    const iatNExp = await this.jwtService.getTokenIatNExp(refreshToken);
    const device = new Device();
    device.userId = userId;
    device.deviceId = newDeviceId;
    device.iat = new Date(iatNExp!.iat * 1000).toISOString();
    device.deviceName = deviceName;
    device.ip = ip;
    device.exp = new Date(iatNExp!.exp * 1000).toISOString();

    await this.devicesService.createDevice(device);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async logoutUser(refreshToken: string): Promise<boolean> {
    const userId = this.jwtService.getUserIdByToken(refreshToken);
    const isTokenInBlacklist =
      await this.refreshTokenBlackListRepo.isTokenInBlacklist(refreshToken);
    const deviceId = this.jwtService.getDeviceIdByToken(refreshToken);
    const isDeviceExist =
      await this.devicesRepo.findSessionByDeviceId(deviceId);
    if (!userId || isTokenInBlacklist || !isDeviceExist) {
      return false;
    }
    await this.devicesRepo.deleteSessionByDeviceId(deviceId);
    await this.refreshTokenBlackListRepo.addTokenInBlacklist(refreshToken);
    return true;
  }

  async createNewTokens(refreshToken: string): Promise<TokensType | null> {
    const isTokenInBlacklist =
      await this.refreshTokenBlackListRepo.isTokenInBlacklist(refreshToken);
    const userId = await this.jwtService.getUserIdByToken(refreshToken);
    const deviceId = await this.jwtService.getDeviceIdByToken(refreshToken);
    if (!deviceId) {
      return null;
    }
    const oldIat = await this.jwtService.getTokenIatNExp(refreshToken);
    const isDeviceExist =
      await this.devicesRepo.findSessionByDeviceId(deviceId);
    if (!userId || isTokenInBlacklist || !isDeviceExist) {
      return null;
    }
    await this.refreshTokenBlackListRepo.addTokenInBlacklist(refreshToken);
    const newAccessToken = this.jwtService.createAccessJWTToken(userId);
    const newRefreshToken = this.jwtService.createRefreshJWTToken(
      userId,
      deviceId,
    );
    const iatNExp = this.jwtService.getTokenIatNExp(newRefreshToken);
    await this.devicesService.updateDeviceIatNExp(
      deviceId,
      new Date(oldIat!.iat * 1000).toISOString(),
      new Date(iatNExp!.iat * 1000).toISOString(),
      new Date(iatNExp!.exp * 1000).toISOString(),
    );
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async confirmUserEmail(confirmationCode: string): Promise<boolean> {
    const userEmailConfirmationInfo =
      await this.usersRepo.findUserByEmailConfirmationCode(confirmationCode);
    if (userEmailConfirmationInfo) {
      await this.usersRepo.updateAccessUserEmailConfirmation(
        userEmailConfirmationInfo.userId,
      );
      return true;
    }
    return false;
  }

  async confirmUserEmailResending(email: string): Promise<boolean> {
    const user = await this.usersRepo.findUserByLoginOrEmail(email);
    if (user) {
      const userEmailConfirmation = new UserEmailConfirmation();
      userEmailConfirmation.confirmationCode = randomUUID().toString();
      userEmailConfirmation.expirationDate = add(new Date(), {
        hours: 1,
        minutes: 1,
      }).toISOString();
      const result = await this.usersRepo.updateUserEmailConfirmation(
        user.id,
        userEmailConfirmation,
      );
      if (result) {
        this.nodemailerService
          .sendRegistrationEmail(
            user.email,
            'User registration new code',
            userEmailConfirmation.confirmationCode,
          )
          .catch((error) => {
            console.error(error);
          });
      }
      return true;
    }
    return false;
  }

  async passwordRecovery(email: string): Promise<boolean> {
    const user = await this.usersRepo.findUserByLoginOrEmail(email);
    if (user) {
      const userPasswordRecovery = new UserPasswordRecovery();
      userPasswordRecovery.userId = user.id;
      userPasswordRecovery.recoveryCode = randomUUID().toString();
      userPasswordRecovery.expirationDate = add(new Date(), {
        hours: 1,
        minutes: 1,
      }).toISOString();
      const result =
        await this.usersRepo.passwordRecoveryConfirmation(userPasswordRecovery);
      if (result) {
        this.nodemailerService
          .sendPasswordRecoveryEmail(
            email,
            'password recovery code',
            userPasswordRecovery.recoveryCode!,
          )
          .catch((error) => {
            console.error(error);
          });
        return true;
      }
    }
    return false;
  }

  async newPasswordConfirmation(
    password: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const user =
      await this.usersRepo.findUserByPasswordRecoveryCode(recoveryCode);
    if (user) {
      const newPasswordHash = await this.bcryptService.genHash(password);
      await this.usersRepo.updatePasswordRecovery(
        user.userId!,
        newPasswordHash,
      );
      return true;
    }
    return false;
  }
}
