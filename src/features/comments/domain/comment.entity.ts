import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/domain/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn()
  post: Post;

  /*@OneToMany(() => CommentUserLikeStatus, (user) => user.comment)
  @JoinColumn()
  likeStatuses: CommentUserLikeStatus[];*/
}

@Entity()
export class CommentatorInfo {
  @PrimaryColumn({ type: 'uuid' })
  commentId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 10 })
  userLogin: string;

  /*@OneToOne(() => Comment, (comment) => comment.id)
  @JoinColumn()
  comment: Comment;*/

  /*@ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;*/
}
