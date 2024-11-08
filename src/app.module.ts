import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SETTINGS } from './settings/app.settings';
import * as process from 'process';
import { UserModule } from './features/users/user.module';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';
import { AuthModule } from './features/auth/auth.module';
import { DeviceModule } from './features/securityDevices/device.module';
import { HelloPageModule } from './base/hello.page/hello.page';
import {
  emailConfirmationCodeIsExist,
  emailIsExist,
  emailResendingIsEmailConfirmed,
  loginIsExist,
  passwordRecoveryCodeIsExist,
} from './infrastructure/decorators/auth.custom.decorator';
import { JwtService } from './infrastructure/utils/services/jwt.service';
import { BcryptService } from './infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from './infrastructure/utils/services/nodemailer.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    process.env.DB_CONNECTION === 'NEON'
      ? SETTINGS.DB_CONNECTION.CONNECT_TO_NEON_DB
      : SETTINGS.DB_CONNECTION.CONNECT_TO_TEST_DB,
    SETTINGS.REQ_COUNTER,
    UserModule,
    AuthModule,
    DeviceModule,
    //BlogModule,
    //PostModule,
    //CommentModule,
    HelloPageModule,
  ],

  providers: [
    BcryptService,
    NodemailerService,
    JwtService,
    loginIsExist,
    emailIsExist,
    passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,
  ],

  controllers: [DeleteAllController],
})
export class AppModule {}
