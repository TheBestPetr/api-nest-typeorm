import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../../securityDevices/domain/device.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  login: string;

  @Column({ type: 'varchar', select: false })
  passwordHash: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  @OneToMany(() => Device, (device) => device.user)
  @JoinColumn()
  devices: Device[];

  //@OneToMany(() => CommentUserLikeStatus, (commentLikes) => commentLikes.user)
  //@JoinColumn()
  // userCommentLikes: CommentUserLikeStatus[];
}

@Entity()
export class EmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: string | null;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}

@Entity()
export class PasswordRecovery {
  @PrimaryColumn({ type: 'uuid' })
  userId: string | null;

  @Column({ type: 'varchar', nullable: true })
  recoveryCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: string | null;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
