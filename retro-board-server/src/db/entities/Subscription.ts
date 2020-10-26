import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import UserEntity from './User';

@Entity({ name: 'subscriptions' })
export default class SubscriptionEntity {
  @PrimaryColumn({ primary: true, generated: false, unique: true })
  public id: string;
  @Column({ nullable: false, default: false })
  public active: boolean;
  @ManyToOne(() => UserEntity, { eager: true, cascade: true, nullable: false })
  public owner: UserEntity;
  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'subscriptions-users' })
  public users: UserEntity[] | undefined;
  @CreateDateColumn({ type: 'timestamp with time zone', select: false })
  public created: Date | undefined;
  @UpdateDateColumn({ type: 'timestamp with time zone', select: false })
  public updated: Date | undefined;
  constructor(id: string, owner: UserEntity) {
    this.id = id;
    this.owner = owner;
    this.active = true;
  }
}
