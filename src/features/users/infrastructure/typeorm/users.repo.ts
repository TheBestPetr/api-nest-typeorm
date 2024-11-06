import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  /*async createUser(
    user: User,
    emailConfirmation: EmailConfirmation,
  ): Promise<User> {}*/
}
