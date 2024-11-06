import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Post } from '../../posts/domain/post.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  websiteUrl: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  @Column({ type: 'boolean' })
  isMembership: boolean;

  @OneToMany(() => Post, (post) => post.blog)
  @JoinColumn()
  posts: Post[];
}
