import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserPasswordRecovery,
  User,
  UserEmailConfirmation,
} from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/sql/users.repository';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { UsersService } from './application/users.service';
import { UsersQueryRepository } from './infrastructure/sql/users.query.repository';
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
  providers: [
    UsersRepository,
    UsersRepo,
    UsersQueryRepository,
    UsersQueryRepo,
    BcryptService,
    UsersService,
  ],
  exports: [UsersRepository, UsersQueryRepository, UsersRepo, UsersQueryRepo],
})
export class UserModule {}
