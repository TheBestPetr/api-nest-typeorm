import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SETTINGS } from './settings/app.settings';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    process.env.DB_CONNECTION === 'NEON'
      ? SETTINGS.DB_CONNECTION.CONNECT_TO_NEON_DB
      : SETTINGS.DB_CONNECTION.CONNECT_TO_TEST_DB,
    /*AuthModule,
    DeviceModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentModule,
    HelloPageModule,*/
  ],

  providers: [
    /*loginIsExist,
    emailIsExist,
    passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,*/
  ],

  controllers: [
    /*DeleteAllController*/
  ],
})
export class AppModule {}
