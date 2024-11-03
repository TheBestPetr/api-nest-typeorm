import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  websiteUrl: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'boolean' })
  isMembership: boolean;
}
