import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { Comment } from '../../comments/domain/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
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

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @JoinColumn()
  blog: Blog;

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn()
  comments: Comment[];

  /*@OneToMany(() => PostUserLikeStatus, (user) => user.post)
  @JoinColumn()
  likeStatuses: PostUserLikeStatus[];*/
}
