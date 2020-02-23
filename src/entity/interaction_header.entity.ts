import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { mChannel } from "./m_channel.entity";
import { Customer } from "./customer.entity";
import { mGroup } from "./m_group.entity";

@Entity()
export class InteractionHeader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  sessionId: string;

  @Column({ length: 11, nullable: true })
  channelId: string;
  @ManyToOne(
    type => mChannel,
    m_channel => m_channel.id
  )
  @JoinColumn()
  channel: mChannel;

  @Column({ length: 50, nullable: true })
  account: string;

  @Column({ nullable: true })
  customerId: number;
  @ManyToOne(
    type => Customer,
    customer => customer.id
  )
  @JoinColumn()
  customer: Customer;

  @Column({ length: 50 })
  from: string;

  @Column({ length: 50, nullable: true })
  fromName: string;

  @Column({ length: 20, nullable: true })
  agentUsername: number;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  agent: User;

  @Column({ nullable: true })
  groupId: number;
  @ManyToOne(
    type => mGroup,
    m_group => m_group.id
  )
  @JoinColumn()
  group: mGroup;

  @Column({ type: "smallint", default: 0 })
  priority: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  pickupDate: Date;

  @Column({ nullable: true })
  frDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  submitCwcDate: Date;

  @Column({
    default: false
  })
  endStatus: boolean;

  @Column({ nullable: true })
  caseIn: number;

  @Column({ nullable: true })
  caseOut: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
