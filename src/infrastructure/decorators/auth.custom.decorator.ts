import { BadRequestException, Injectable } from '@nestjs/common';
import {
  isUUID,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepository } from '../../features/users/infrastructure/sql/users.repository';
import { UsersRepo } from '../../features/users/infrastructure/typeorm/users.repo';

@ValidatorConstraint({ name: 'passwordRecoveryCodeIsExist', async: true })
@Injectable()
export class passwordRecoveryCodeIsExist
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(recoveryCode: string) {
    if (!isUUID(recoveryCode)) {
      throw new BadRequestException([
        { message: 'code must de uuid', field: 'code' },
      ]);
    }
    const userPasswordRecovery =
      await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);
    if (
      !userPasswordRecovery ||
      userPasswordRecovery.expirationDate! < new Date().toISOString()
    ) {
      throw new BadRequestException([
        { message: 'Some Error', field: 'recoveryCode' },
      ]);
    }
    return true;
  }
}

@ValidatorConstraint({ name: 'loginOrEmailIsExist', async: true })
@Injectable()
export class loginOrEmailIsExist implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  async validate(loginOrEmail: string) {
    const user = await this.usersRepo.findUserByLoginOrEmail(loginOrEmail);
    if (user) {
      throw new BadRequestException([
        { message: 'Email is already exist', field: 'email' },
      ]);
    }
    return true;
  }
}

@ValidatorConstraint({ name: 'emailConfirmationCodeIsExist', async: true })
@Injectable()
export class emailConfirmationCodeIsExist
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(confirmationCode: string) {
    if (!isUUID(confirmationCode)) {
      throw new BadRequestException([
        { message: 'code must de uuid', field: 'code' },
      ]);
    }
    const userEmailConfirmation =
      await this.usersRepository.findUserByEmailConfirmationCode(
        confirmationCode,
      );
    if (
      !userEmailConfirmation ||
      userEmailConfirmation.expirationDate! < new Date().toISOString() ||
      userEmailConfirmation.isConfirmed
    ) {
      throw new BadRequestException([{ message: 'Some Error', field: 'code' }]);
    }
    return true;
  }
}

@ValidatorConstraint({ name: 'emailResendingIsEmailConfirmed', async: true })
@Injectable()
export class emailResendingIsEmailConfirmed
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(email: string) {
    const userEmailConfirmationInfo =
      await this.usersRepository.findUserEmailConfirmationInfo(email);
    if (!userEmailConfirmationInfo) {
      throw new BadRequestException([
        { message: 'User does not exist', field: 'email' },
      ]);
    }
    if (userEmailConfirmationInfo[0].isConfirmed === true) {
      throw new BadRequestException([
        { message: 'Email is already confirmed', field: 'email' },
      ]);
    }
    return true;
  }
}
