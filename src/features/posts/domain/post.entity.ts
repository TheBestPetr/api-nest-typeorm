import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  shortDescription: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'uuid' })
  blogId: string;

  @Column({ type: 'varchar' })
  blogName: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @Column({ type: 'integer' })
  likesCount: number;

  @Column({ type: 'integer' })
  dislikesCount: number;
}
