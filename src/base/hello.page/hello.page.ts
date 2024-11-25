import {
  Controller,
  Get,
  Request,
  HttpCode,
  UseGuards,
  Module,
} from '@nestjs/common';
import { BearerAuthWithout401 } from '../../infrastructure/decorators/bearer.auth.without.401';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { User } from '../../features/users/domain/user.entity';

@Controller('/')
export class helloPageController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @UseGuards(BearerAuthWithout401)
  @Get()
  @HttpCode(200)
  async sayHello(@Request() req) {
    let user = 'dear user';
    if (req.userId) {
      const userLogin = await this.dataSource
        .createQueryBuilder(User, 'u')
        .where('u.id = :userId', { userId: req.userId })
        .getOne();
      user = userLogin?.login ?? 'dear user';
    }
    return `Welcome to new project with typeorm, ${user}`;
  }
}

@Module({
  controllers: [helloPageController],
  providers: [JwtService],
})
export class HelloPageModule {}
