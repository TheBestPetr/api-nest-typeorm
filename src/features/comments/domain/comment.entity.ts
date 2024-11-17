import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/domain/post.entity';
import {
  CommentLikesCountInfo,
  CommentUserLikeStatus,
} from './comment.like.entity';
import { CommentatorInfo } from './commentator.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToOne(() => CommentatorInfo, (commentator) => commentator.comment)
  commentator: CommentatorInfo;

  @OneToMany(() => CommentUserLikeStatus, (user) => user.comment)
  likeStatuses: CommentUserLikeStatus[];

  @OneToOne(
    () => CommentLikesCountInfo,
    (commentLikesCount) => commentLikesCount.comment,
  )
  likesCountInfo: CommentLikesCountInfo;
}
