import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../users/domain/user.entity';

@Entity({ name: 'post_likes_status_info' })
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

  @ManyToOne(() => Post, (post) => post.likeStatuses)
  post: Post;

  @ManyToOne(() => User, (user) => user.userPostsLikes)
  user: User;
}

@Entity({ name: 'post_likes_count_info' })
export class PostLikesCountInfo {
  @PrimaryColumn({ type: 'uuid' })
  postId: string;

  @Column({ type: 'integer', default: 0 })
  likesCount: number;

  @Column({ type: 'integer', default: 0 })
  dislikesCount: number;

  @OneToOne(() => Post, (post) => post.id)
  post: Post;
}
