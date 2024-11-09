import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SETTINGS } from './settings/app.settings';
import * as process from 'process';
import { DeleteAllController } from './features/zTesting(dropDb)/delete.all';
import { HelloPageModule } from './base/hello.page/hello.page';
import { JwtService } from './infrastructure/utils/services/jwt.service';
import { BcryptService } from './infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from './infrastructure/utils/services/nodemailer.service';
import { AllModules } from './settings/modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    process.env.DB_CONNECTION === 'NEON'
      ? SETTINGS.DB_CONNECTION.CONNECT_TO_NEON_DB
      : SETTINGS.DB_CONNECTION.CONNECT_TO_TEST_DB,
    SETTINGS.REQ_COUNTER,
    AllModules,
    HelloPageModule,
  ],

  providers: [BcryptService, NodemailerService, JwtService],

  controllers: [DeleteAllController],
})
export class AppModule {}
