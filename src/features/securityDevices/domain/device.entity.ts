import { Column, Entity } from 'typeorm';

@Entity()
export class Device {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'timestamp with time zone' })
  iat: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'timestamp with time zone' })
  exp: string;
}
