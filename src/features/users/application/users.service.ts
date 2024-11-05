import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/sql/users.repository';
import { UserInputDto } from '../api/dto/input/user.input.dto';
import { UserOutputDto } from '../api/dto/output/user.output.dto';
import { EmailConfirmation, User } from '../domain/user.entity';
import { BcryptService } from '../../../infrastructure/utils/services/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async createSuperUser(input: UserInputDto): Promise<UserOutputDto> {
    const passwordHash = await this.bcryptService.genHash(input.password);
    const user = new User();
    user.login = input.login;
    user.passwordHash = passwordHash;
    user.email = input.email;
    const userEmailConfirmation = new EmailConfirmation();
    userEmailConfirmation.confirmationCode = null;
    userEmailConfirmation.expirationDate = null;
    userEmailConfirmation.isConfirmed = true;

    const insertedUser = await this.usersRepository.createUser(
      user,
      userEmailConfirmation,
    );
    return {
      id: insertedUser.id,
      login: user.login,
      email: user.email,
      createdAt: insertedUser.createdAt,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }
}
