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

@Controller('/')
export class helloPageController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @UseGuards(BearerAuthWithout401)
  @Get()
  @HttpCode(200)
  async sayHello(@Request() req) {
    let user = 'dear user';
    if (req.userId) {
      const isUserExist = await this.dataSource.query(
        `
      SELECT "login"
        FROM public.users
        WHERE "id" = $1`,
        [req.userId],
      );
      user = isUserExist[0].login;
    }
    return `Long time no see, ${user}`;
  }
}

@Module({
  controllers: [helloPageController],
  providers: [JwtService],
})
export class HelloPageModule {}
