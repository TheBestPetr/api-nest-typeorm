import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { ILike, Repository } from 'typeorm';
import { UserInputQueryDto } from '../../api/dto/input/user.input.dto';
import { UserOutputQueryDto } from '../../api/dto/output/user.output.dto';
import { AuthIOutputDto } from '../../../auth/api/dto/output/auth.output.dto';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectRepository(User) private readonly usersQueryRepo: Repository<User>,
  ) {}

  async findUsers(query: UserInputQueryDto): Promise<UserOutputQueryDto> {
    const searchWithEmail = query.searchEmailTerm ?? '';
    const searchWithLogin = query.searchLoginTerm ?? '';
    const [items, count] = await this.usersQueryRepo.findAndCount({
      where: [
        { email: ILike(`%${searchWithEmail}%`) },
        { login: ILike(`%${searchWithLogin}%`) },
      ],
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize, // todo something
    });

    return {
      pagesCount: Math.ceil(count / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: count,
      items: items.map((user) => ({
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })),
    };
  }

  async findUserById(userId: string): Promise<AuthIOutputDto | null> {
    const user = await this.usersQueryRepo.findOneBy({ id: userId });
    return user
      ? {
          email: user.email,
          login: user.login,
          userId: user.id,
        }
      : null;
  }
}
