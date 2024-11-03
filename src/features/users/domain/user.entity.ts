import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailConfirmation {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  confirmationCode: string | null;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: string | null;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;
}

@Entity()
export class PasswordRecovery {
  @Column({ type: 'uuid' })
  userId: string | null;

  @Column({ type: 'varchar' })
  recoveryCode: string | null;

  @Column({ type: 'timestamp with time zone' })
  expirationDate: string | null;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 10 })
  login: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: string;
}
