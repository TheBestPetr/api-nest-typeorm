import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenBlackList } from '../../domain/refresh.token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenBlackListRepo {
  constructor(
    @InjectRepository(RefreshTokenBlackList)
    private readonly refreshTokenBlackListRepo: Repository<RefreshTokenBlackList>,
  ) {}

  async addTokenInBlacklist(token: string) {
    const newToken = new RefreshTokenBlackList();
    newToken.token = token;
    await this.refreshTokenBlackListRepo.save(newToken);
  }

  async isTokenInBlacklist(token: string): Promise<boolean> {
    const isTokenInBL = await this.refreshTokenBlackListRepo.findOneBy({
      token: token,
    });
    return !!isTokenInBL;
  }
}
