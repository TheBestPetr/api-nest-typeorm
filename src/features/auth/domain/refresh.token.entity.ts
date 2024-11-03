import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @Column({ type: 'varchar' })
  token: string;
}
