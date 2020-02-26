import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";

import { mCategory } from "./m_category.entity";
import { mSubCategory } from "./m_sub_category.entity";
import { mChannel } from "./m_channel.entity";
import { Customer } from "./customer.entity";
import { InteractionHeaderHistory } from "./interaction_header_history.entity";
import { User } from "./user.entity";

export enum CwcType {
  MANUAL = "manual",
  INTERACTION = "interaction"
}

@Entity()
export class Cwc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: CwcType,
    default: CwcType.INTERACTION
  })
  type: CwcType;

  @Column({ length: 40, nullable: true })
  name: string;

  @Column({ length: 11 })
  channelId: string;
  @ManyToOne(
    type => mChannel,
    m_channel => m_channel.id
  )
  @JoinColumn()
  channel: mChannel;

  @Column({ length: 50 })
  sessionId: string;

  @Column()
  customerId: number;
  @ManyToOne(
    type => Customer,
    customer => customer.id
  )
  @JoinColumn()
  customer: Customer;

  @Column()
  categoryId: number;
  @ManyToOne(
    type => mCategory,
    m_category => m_category.id
  )
  @JoinColumn()
  category: mCategory;

  @Column()
  subcategoryId: number;
  @ManyToOne(
    type => mSubCategory,
    mSubCategory => mSubCategory.id
  )
  @JoinColumn()
  subcategory: mSubCategory;

  @Column({ type: "text" })
  remark: string;

  @Column({ type: "text" })
  feedback: string;

  @Column({ type: "tinyint" })
  sentiment: number;

  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  agent: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({ length: 20, nullable: true })
  updaterUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  updater: User;
}
