import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthIOutputDto } from '../../../auth/api/dto/output/auth.output.dto';
import { UserInputQueryDto } from '../../api/dto/input/user.input.dto';
import { UserOutputQueryDto } from '../../api/dto/output/user.output.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async findUsers(query: UserInputQueryDto): Promise<UserOutputQueryDto> {
    const searchWithEmail = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : '%';
    const searchWithLogin = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : '%';
    const items = await this.dataSource.query(
      `SELECT id, login, email, "createdAt"
        FROM public.users
        WHERE "login" ILIKE $2 OR "email" ILIKE $1
        ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
        LIMIT $3 OFFSET $4`,
      [
        searchWithEmail,
        searchWithLogin,
        query.pageSize,
        (query.pageNumber - 1) * query.pageSize,
      ],
    );
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.users
        WHERE "email" ILIKE $1 OR "login" ILIKE $2`,
      [searchWithEmail, searchWithLogin],
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount as number,
      items: items.map((user) => ({
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })),
    };
  }

  async findUserById(userId: string): Promise<AuthIOutputDto> {
    const user = await this.dataSource.query(
      `SELECT *
        FROM public.users
        WHERE "id" = '${userId}';`,
    );
    return {
      email: user[0].email,
      login: user[0].login,
      userId: user[0].id,
    };
  }
}
