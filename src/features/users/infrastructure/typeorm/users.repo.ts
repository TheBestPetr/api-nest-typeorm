import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEmailConfirmation,
  User,
  UserPasswordRecovery,
} from '../../domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(UserEmailConfirmation)
    private readonly userEmailConfirmationRepo: Repository<UserEmailConfirmation>,
    @InjectRepository(UserPasswordRecovery)
    private readonly userPasswordRecoveryRepo: Repository<UserPasswordRecovery>,
  ) {}

  async createUser(
    user: User,
    userEmailConfirmation: UserEmailConfirmation,
  ): Promise<User> {
    const insertedUser = await this.usersRepo.save(user);
    userEmailConfirmation.userId = insertedUser.id;
    await this.userEmailConfirmationRepo.save(userEmailConfirmation);
    return insertedUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const isUserEmailConfirmationDeleted =
      await this.userEmailConfirmationRepo.delete(userId);
    const isUserDeleted = await this.usersRepo.delete(userId);
    return (
      isUserDeleted.affected === 1 ||
      isUserEmailConfirmationDeleted.affected === 1
    );
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findUserEmailConfirmationInfo(
    loginOrEmail: string,
  ): Promise<UserEmailConfirmation | null> {
    const user = await this.usersRepo.findOneBy([
      { login: loginOrEmail },
      { email: loginOrEmail },
    ]);
    if (user) {
      return this.userEmailConfirmationRepo.findOneBy({ userId: user.id });
    }
    return null;
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserEmailConfirmation | null> {
    return this.userEmailConfirmationRepo.findOneBy({
      confirmationCode: code,
    });
  }

  async updateAccessUserEmailConfirmation(id: string): Promise<boolean> {
    const emailConfirmation = await this.userEmailConfirmationRepo.findOneBy({
      userId: id,
    });
    if (emailConfirmation) {
      emailConfirmation.confirmationCode = null;
      emailConfirmation.expirationDate = null;
      emailConfirmation.isConfirmed = true;
      await this.userEmailConfirmationRepo.save(emailConfirmation);
    }
    return !!emailConfirmation;
  }

  async updateUserEmailConfirmation(
    userId: string,
    input: UserEmailConfirmation,
  ): Promise<boolean> {
    const emailConfirmation = await this.userEmailConfirmationRepo.findOneBy({
      userId: userId,
    });
    if (emailConfirmation) {
      emailConfirmation.confirmationCode = input.confirmationCode;
      emailConfirmation.expirationDate = input.expirationDate;
      await this.userEmailConfirmationRepo.save(emailConfirmation);
    }
    return !!emailConfirmation;
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserPasswordRecovery | null> {
    return this.userPasswordRecoveryRepo.findOneBy({ recoveryCode: code });
  }

  async passwordRecoveryConfirmation(passwordRecovery: UserPasswordRecovery) {
    return this.userPasswordRecoveryRepo.save(passwordRecovery);
  }

  async updatePasswordRecovery(
    userId: string,
    newPasswordHash: string,
  ): Promise<boolean> {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (user) {
      user.passwordHash = newPasswordHash;
      await this.usersRepo.save(user);
    }
    const isPasswordRecoveryUpdated =
      await this.userPasswordRecoveryRepo.delete({ userId: userId });
    return isPasswordRecoveryUpdated.affected === 1;
  }
}
