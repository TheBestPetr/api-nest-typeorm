import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DeviceModule } from './features/securityDevices/device.module';
import { UserModule } from './features/users/user.module';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';
import {
  emailConfirmationCodeIsExist,
  emailIsExist,
  emailResendingIsEmailConfirmed,
  loginIsExist,
  passwordRecoveryCodeIsExist,
} from './infrastructure/decorators/auth.custom.decorator';
import { BlogModule } from './features/blogs/blog.module';
import { PostModule } from './features/posts/post.module';
import { CommentModule } from './features/comments/comment.module';
import { SETTINGS } from './settings/app.settings';
import * as process from 'process';
import { HelloPageModule } from './base/hello.page/hello.page';

@Module({
  imports: [
    process.env.DB_CONNECTION === 'NEON'
      ? SETTINGS.DB_CONNECTION.CONNECT_TO_NEON_DB
      : SETTINGS.DB_CONNECTION.CONNECT_TO_TEST_DB,
    AuthModule,
    DeviceModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentModule,
    HelloPageModule,
  ],

  providers: [
    loginIsExist,
    emailIsExist,
    passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,
  ],

  controllers: [DeleteAllController],
})
export class AppModule {}
