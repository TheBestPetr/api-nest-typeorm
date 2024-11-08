import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class CommentUserLikeStatus {
  @PrimaryColumn({ type: 'uuid' })
  commentId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ enum: ['None', 'Like', 'Dislike'] })
  status: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  /*@ManyToOne(() => Comment, (comment) => comment.likeStatuses)
  @JoinColumn()
  comment: Comment;*/

  //@ManyToOne(() => User, (user) => user.userCommentLikes)
  // @JoinColumn()
  //user: User;
}

@Entity()
export class CommentLikesCountInfo {
  @PrimaryColumn({ type: 'uuid', unique: true })
  commentId: string;

  @Column({ type: 'integer', default: 0 })
  likesCount: number;

  @Column({ type: 'integer', default: 0 })
  dislikesCount: number;

  @OneToOne(() => Comment, (comment) => comment.id)
  @JoinColumn()
  comment: Comment;
}
