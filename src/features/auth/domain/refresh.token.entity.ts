import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryColumn({ type: 'varchar' })
  token: string;
}
