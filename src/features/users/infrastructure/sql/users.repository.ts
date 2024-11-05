import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  EmailConfirmation,
  PasswordRecovery,
  User,
} from '../../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(inputUser: User, inputEmailConfirmation: EmailConfirmation) {
    const insertedUser = await this.dataSource.query(`
        INSERT INTO public.users(
            login, 
            "passwordHash", 
            email)
            VALUES (
                '${inputUser.login}',
                '${inputUser.passwordHash}',
                '${inputUser.email}')
            RETURNING *;
    `);
    await this.dataSource.query(`
        INSERT INTO public."usersEmailConfirmation"(
            "userId",
            "isConfirmed")
            VALUES (
                '${insertedUser[0].id}',
                '${inputEmailConfirmation.isConfirmed}');
    `);
    return insertedUser[0];
  }

  async deleteUser(userId: string): Promise<boolean> {
    const isUserEmailConfirmationDeleted = await this.dataSource.query(`
        DELETE FROM public."usersEmailConfirmation"
            WHERE "userId" = '${userId}'
    `);
    const isUserDeleted = await this.dataSource.query(`
        DELETE FROM public.users
            WHERE "id" = '${userId}'
    `);
    return isUserEmailConfirmationDeleted[1] === 1 || isUserDeleted[1] === 1;
  }

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
  ): Promise<EmailConfirmation | null> {
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
    inputEmailConfirmation: EmailConfirmation,
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
    inputPasswordRecovery: PasswordRecovery,
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
