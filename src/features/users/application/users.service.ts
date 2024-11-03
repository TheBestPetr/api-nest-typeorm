import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
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
    const createdUser = new User();
    createdUser.login = input.login;
    createdUser.passwordHash = passwordHash;
    createdUser.email = input.email;
    const userEmailConfirmation = new EmailConfirmation();
    userEmailConfirmation.confirmationCode = null;
    userEmailConfirmation.expirationDate = null;
    userEmailConfirmation.isConfirmed = true;

    const insertedUser = await this.usersRepository.createUser(
      createdUser,
      userEmailConfirmation,
    );
    return {
      id: insertedUser.id,
      login: createdUser.login,
      email: createdUser.email,
      createdAt: insertedUser.createdAt,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }
}
