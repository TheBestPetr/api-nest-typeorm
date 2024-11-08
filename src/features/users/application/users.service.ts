import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../api/dto/input/user.input.dto';
import { UserOutputDto } from '../api/dto/output/user.output.dto';
import { UserEmailConfirmation, User } from '../domain/user.entity';
import { BcryptService } from '../../../infrastructure/utils/services/bcrypt.service';
import { UsersRepo } from '../infrastructure/typeorm/users.repo';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly bcryptService: BcryptService,
  ) {}

  async createSuperUser(input: UserInputDto): Promise<UserOutputDto> {
    const passwordHash = await this.bcryptService.genHash(input.password);
    const user = new User();
    user.login = input.login;
    user.passwordHash = passwordHash;
    user.email = input.email;
    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.confirmationCode = null;
    userEmailConfirmation.expirationDate = null;
    userEmailConfirmation.isConfirmed = true;

    const insertedUser = await this.usersRepo.createUser(
      user,
      userEmailConfirmation,
    );
    return {
      id: insertedUser.id,
      login: insertedUser.login,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepo.deleteUser(id);
  }
}
