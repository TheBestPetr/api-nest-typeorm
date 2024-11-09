/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserPasswordRecovery,
  User,
  UserEmailConfirmation,
} from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { UsersService } from './application/users.service';
import { UsersRepo } from './infrastructure/typeorm/users.repo';
import { UsersQueryRepo } from './infrastructure/typeorm/users.query.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserEmailConfirmation,
      UserPasswordRecovery,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepo, UsersRepo, BcryptService],
  exports: [UsersRepo, UsersQueryRepo],
})
export class UserModule {}
*/
