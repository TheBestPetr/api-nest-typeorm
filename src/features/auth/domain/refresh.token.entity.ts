import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_token_black_list' })
export class RefreshTokenBlackList {
  @PrimaryColumn({ type: 'varchar' })
  token: string;
}
