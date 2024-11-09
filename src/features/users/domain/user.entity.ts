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
import { PostUserLikeStatus } from '../../posts/domain/post.like.entity';
import { UserInputDto } from '../api/dto/input/user.input.dto';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  login: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  static create(passwordHash: string, dto: UserInputDto) {
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = passwordHash;
    return user;
  }

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => PostUserLikeStatus, (postLikes) => postLikes.user)
  userPostsLikes: PostUserLikeStatus;

  //@OneToMany(() => CommentUserLikeStatus, (commentLikes) => commentLikes.user)
  // userCommentLikes: CommentUserLikeStatus[];
}

@Entity()
export class UserEmailConfirmation {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: string | null;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  static create() {
    const expDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    }).toISOString();
    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.confirmationCode = randomUUID().toString();
    userEmailConfirmation.expirationDate = expDate;
    userEmailConfirmation.isConfirmed = false;
    return userEmailConfirmation;
  }

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}

@Entity()
export class UserPasswordRecovery {
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
