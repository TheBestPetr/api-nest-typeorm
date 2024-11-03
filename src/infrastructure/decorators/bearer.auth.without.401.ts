import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../utils/services/jwt.service';

@Injectable()
export class BearerAuthWithout401 implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authorization = req.header('Authorization');
    if (!authorization) {
      return true;
    }

    const parts = authorization.split(' ');

    const token = parts[1];

    const splitToken = token.split('.');
    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer' ||
      splitToken.length !== 3
    ) {
      return true;
    }

    try {
      const userId = await this.jwtService.getUserIdByToken(token);
      req['userId'] = userId;
      return true;
    } catch (e) {
      return true;
    }
  }
}
