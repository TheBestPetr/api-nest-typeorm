import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentatorInfo {
  @Column({ type: 'uuid' })
  commentId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 10 })
  userLogin: string;
}

@Entity()
export class LikesInfo {
  @Column()
  commentId: string;

  @Column({ type: 'integer' })
  likesCount: number;

  @Column({ type: 'integer' })
  dislikesCount: number;
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;
}
