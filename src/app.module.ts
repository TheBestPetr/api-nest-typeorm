import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SETTINGS } from './settings/app.settings';
import * as process from 'process';
import { UserModule } from './features/users/user.module';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';
import { AuthModule } from './features/auth/auth.module';
import { DeviceModule } from './features/securityDevices/device.module';
import { HelloPageModule } from './base/hello.page/hello.page';
import { loginOrEmailIsExist } from './infrastructure/decorators/auth.custom.decorator';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    process.env.DB_CONNECTION === 'NEON'
      ? SETTINGS.DB_CONNECTION.CONNECT_TO_NEON_DB
      : SETTINGS.DB_CONNECTION.CONNECT_TO_TEST_DB,
    UserModule,
    AuthModule,
    DeviceModule,
    //BlogModule,
    //PostModule,
    //CommentModule,
    HelloPageModule,
  ],

  providers: [
    loginOrEmailIsExist,
    /*passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,*/
  ],

  controllers: [DeleteAllController],
})
export class AppModule {}
