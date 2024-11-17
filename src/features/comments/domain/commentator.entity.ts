import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'commentator_info' })
export class CommentatorInfo {
  @PrimaryColumn({ type: 'uuid' })
  commentId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 10 })
  userLogin: string;

  @OneToOne(() => Comment, (comment) => comment.commentator)
  @JoinColumn()
  comment: Comment;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
