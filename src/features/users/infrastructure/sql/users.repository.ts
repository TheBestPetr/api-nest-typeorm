import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  UserEmailConfirmation,
  UserPasswordRecovery,
} from '../../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.dataSource.query(`
        SELECT 
            id, 
            login, 
            "passwordHash", 
            email, 
            "createdAt"
            FROM public.users
            WHERE "login" = '${loginOrEmail}' OR 
                  "email" = '${loginOrEmail}'
    `);
  }

  async findUserEmailConfirmationInfo(loginOrEmail: string) {
    const user = await this.dataSource.query(`
        SELECT 
            id, 
            login, 
            "passwordHash", 
            email, 
            "createdAt"
            FROM public.users
            WHERE "login" = '${loginOrEmail}' OR 
                  "email" = '${loginOrEmail}'
    `);
    if (user.length > 0) {
      return this.dataSource.query(`
        SELECT "userId", "confirmationCode", "expirationDate", "isConfirmed"
            FROM public."usersEmailConfirmation"
            WHERE "userId" = '${user[0].id}'
        `);
    }
    return false;
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserEmailConfirmation | null> {
    const user = await this.dataSource.query(`
        SELECT 
            "userId", 
            "confirmationCode", 
            "expirationDate", 
            "isConfirmed"
            FROM public."usersEmailConfirmation"
            WHERE "confirmationCode" = '${code}'
    `);
    if (user[0].isConfirmed === true) {
      return null;
    }
    if (user.length > 0) {
      return user;
    }
    return null;
  }

  async updateAccessUserEmailConfirmation(id: string): Promise<boolean> {
    const result = await this.dataSource.query(`
        UPDATE public."usersEmailConfirmation"
            SET 
                "expirationDate" = null, 
                "isConfirmed" = true
                WHERE "userId" = '${id}';`);
    return !!result;
  }

  async updateUserEmailConfirmation(
    userId: string,
    inputEmailConfirmation: UserEmailConfirmation,
  ): Promise<boolean> {
    const result = await this.dataSource.query(`
        UPDATE public."usersEmailConfirmation"
            SET 
                "confirmationCode" = '${inputEmailConfirmation.confirmationCode}', 
                "expirationDate" = '${inputEmailConfirmation.expirationDate}'
                WHERE "userId" = '${userId}';`);
    return !!result;
  }

  async findUserByPasswordRecoveryCode(code: string) {
    return this.dataSource.query(`
        SELECT "userId", "recoveryCode", "expirationDate"
        FROM public."usersPasswordRecovery"
        WHERE "recoveryCode" = '${code}'
    `);
  }

  async passwordRecoveryConfirmation(
    email: string,
    inputPasswordRecovery: UserPasswordRecovery,
  ) {
    return this.dataSource.query(`
    INSERT INTO public."usersPasswordRecovery"(
        "userId", 
        "recoveryCode", 
        "expirationDate"
        )
        VALUES(
        '${inputPasswordRecovery.userId}',
        '${inputPasswordRecovery.recoveryCode}',
        '${inputPasswordRecovery.expirationDate}'
        )
    `);
  }

  async updatePasswordRecovery(
    userId: string,
    newPasswordHash: string,
  ): Promise<boolean> {
    const isPasswordHashUpdated = await this.dataSource.query(`
      UPDATE public.users
            SET "passwordHash" = '${newPasswordHash}'
            WHERE "id" = '${userId}';`);
    const isPasswordRecoveryUpdated = await this.dataSource.query(`
        DELETE FROM public."usersPasswordRecovery"
            WHERE "userId" = '${userId}';`);
    return isPasswordHashUpdated || isPasswordRecoveryUpdated;
  }
}
