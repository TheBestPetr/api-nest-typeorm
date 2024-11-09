import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  /*@ManyToOne(() => Post, (post) => post.comments)
  post: Post;*/

  /*@OneToMany(() => CommentUserLikeStatus, (user) => user.comment)
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
  comment: Comment;*/

  /*@ManyToOne(() => User, (user) => user.id)
  user: User;*/
}
