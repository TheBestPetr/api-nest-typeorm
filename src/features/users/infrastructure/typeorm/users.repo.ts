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
    const result = await this.userEmailConfirmationRepo.update(
      { userId: id },
      { expirationDate: null, isConfirmed: true },
    );
    return result.affected === 1;
  }

  async updateUserEmailConfirmation(
    userId: string,
    inputEmailConfirmation: UserEmailConfirmation,
  ): Promise<boolean> {
    const result = await this.userEmailConfirmationRepo.update(
      { userId: userId },
      {
        confirmationCode: inputEmailConfirmation.confirmationCode,
        expirationDate: inputEmailConfirmation.expirationDate,
      },
    );
    return result.affected === 1;
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
    const isPasswordHashUpdated = await this.usersRepo.update(
      { id: userId },
      { passwordHash: newPasswordHash },
    );
    const isPasswordRecoveryUpdated =
      await this.userPasswordRecoveryRepo.delete({ userId: userId });
    return (
      isPasswordHashUpdated.affected === 1 ||
      isPasswordRecoveryUpdated.affected === 1
    );
  }
}
