import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PostLikeEntity {
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
}
