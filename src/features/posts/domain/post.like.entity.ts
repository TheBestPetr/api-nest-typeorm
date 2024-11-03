import { Column, Entity } from 'typeorm';

@Entity()
export class PostLikeEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  userLogin: string;

  @Column({ enum: ['None', 'Like', 'Dislike'] })
  status: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;
}
