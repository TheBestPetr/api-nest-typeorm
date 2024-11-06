import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailConfirmation,
  PasswordRecovery,
  User,
} from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/sql/users.repository';
import { BcryptService } from '../../infrastructure/utils/services/bcrypt.service';
import { UsersService } from './application/users.service';
import { UsersQueryRepository } from './infrastructure/sql/users.query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailConfirmation, PasswordRecovery]),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    BcryptService,
    UsersService,
    UsersQueryRepository,
  ],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UserModule {}
