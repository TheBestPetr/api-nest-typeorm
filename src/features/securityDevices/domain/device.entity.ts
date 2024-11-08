import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class Device {
  @Column({ type: 'uuid' })
  userId: string;

  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'timestamp with time zone' })
  iat: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'timestamp with time zone' })
  exp: string;

  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn()
  user: User;
}
