import { Column, Entity } from 'typeorm';

@Entity()
export class ReqCount {
  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  URL: string;

  @Column({ type: 'timestamp with time zone' })
  date: Date;
}
