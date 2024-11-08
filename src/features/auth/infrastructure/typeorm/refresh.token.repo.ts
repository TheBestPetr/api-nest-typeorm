import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../../domain/refresh.token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepo {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async addTokenInBlacklist(token: RefreshToken) {
    await this.refreshTokenRepo.save(token);
  }

  async isTokenInBlacklist(token: string): Promise<boolean> {
    const isTokenInBL = await this.refreshTokenRepo.findOneBy({ token: token });
    return !!isTokenInBL;
  }
}
