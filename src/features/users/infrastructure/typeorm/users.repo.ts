import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmailConfirmation, User } from '../../domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(UserEmailConfirmation)
    private readonly userEmailConfirmationRepo: Repository<UserEmailConfirmation>,
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

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }
}
