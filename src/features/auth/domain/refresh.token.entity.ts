import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RefreshTokenBlackList {
  @PrimaryColumn({ type: 'varchar' })
  token: string;
}
