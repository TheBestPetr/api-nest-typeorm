import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SETTINGS } from '../../settings/app.settings';
import { Buffer } from 'buffer';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization as string;
    if (!auth) {
      throw new UnauthorizedException();
    }

    const encodeString = auth.split(' ');
    const firstTokenPart = encodeString[0];
    const secondTokenPart = encodeString[1];

    if (firstTokenPart !== 'Basic') {
      throw new UnauthorizedException();
    }
    const bytes = Buffer.from(secondTokenPart, 'base64').toString('utf-8');
    const credentials = `${SETTINGS.BASIC.LOGIN}:${SETTINGS.BASIC.PASSWORD}`;

    if (bytes !== credentials) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
