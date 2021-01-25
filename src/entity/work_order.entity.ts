import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { mChannel } from "./m_channel.entity";

@Entity()
@Unique("user_channel", ["agentUsername", "channelId"])
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  agent: User;

  @Column({ length: 11, nullable: true })
  channelId: string;
  @ManyToOne((type) => mChannel, (m_channel) => m_channel.id)
  @JoinColumn()
  channel: mChannel;

  @Column({ type: "smallint", default: 1 })
  limit: number;

  @Column({ type: "smallint", default: 0 })
  slot: number;

  @Column({ nullable: true })
  lastDist: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @Column({ length: 20, nullable: true })
  updaterUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  updater: User;
}
