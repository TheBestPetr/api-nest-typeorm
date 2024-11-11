import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity({ name: 'devices' })
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
  user: User;
}
