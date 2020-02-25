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

@Entity()
export class mGroupSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  agent: User;

  @Column({ length: 11, nullable: true })
  channelId: string;
  @ManyToOne(
    type => mChannel,
    m_channel => m_channel.id
  )
  @JoinColumn()
  channel: mChannel;

  @Column({ type: "smallint", default: 1 })
  limit: number;

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
