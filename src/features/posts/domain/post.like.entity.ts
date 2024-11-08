import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../users/domain/user.entity';

@Entity()
export class PostUserLikeStatus {
  @PrimaryColumn({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  userLogin: string;

  @Column({ enum: ['None', 'Like', 'Dislike'] })
  status: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  /*@ManyToOne(() => Post, (post) => post.likeStatuses)
  @JoinColumn()
  post: Post;*/

  /*@ManyToOne(() => User, (user) => user.userPostsLikes)
  @JoinColumn()
  user: User;*/
}

@Entity()
export class PostLikesCountInfo {
  @PrimaryColumn({ type: 'uuid' })
  postId: string;

  @Column({ type: 'integer', default: 0 })
  likesCount: number;

  @Column({ type: 'integer', default: 0 })
  dislikesCount: number;

  @OneToOne(() => Post, (post) => post.id)
  @JoinColumn()
  post: Post;
}
