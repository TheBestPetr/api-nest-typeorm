import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReqIpCounter implements CanActivate {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { ip, originalUrl } = req;
    await this.dataSource.query(`
        INSERT INTO public."reqCount"(
            ip, "URL", date)
            VALUES ('${ip}', '${originalUrl}', '${new Date().toISOString()}');
    `);

    const currentDate = new Date();
    const tenSecondsAgo = currentDate.setSeconds(currentDate.getSeconds() - 10);
    const reqCount = await this.dataSource.query(`
        SELECT COUNT(*)
            FROM public."reqCount"
            WHERE "ip" = '${req.ip}' AND
                  "URL" = '${req.originalUrl}' AND
                  "date" >= '${new Date(tenSecondsAgo).toISOString()}'
    `);

    if (reqCount[0].count > 5) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
