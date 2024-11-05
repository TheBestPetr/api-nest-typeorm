import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EmailConfirmation {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: string | null;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;
}

@Entity()
export class PasswordRecovery {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', nullable: true })
  recoveryCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: string | null;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  /*@PrimaryColumn({ type: 'uuid', update: false })
  @Generated('uuid')*/
  id: string;

  @Column({ type: 'varchar', length: 10 })
  login: string;

  @Column({ type: 'varchar', select: false })
  passwordHash: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  //@Column({ type: 'timestamp with time zone', update: false })
  createdAt: string;
}
