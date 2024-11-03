import { Column, Entity } from 'typeorm';

@Entity()
export class CommentLikeEntity {
  @Column({ type: 'uuid' })
  commentId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ enum: ['None', 'Like', 'Dislike'] })
  status: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;
}
