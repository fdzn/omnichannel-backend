import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Entity,
} from "typeorm";
import { User } from "./user.entity";
import { mChannel } from "./m_channel.entity";
export enum ActionType {
  IN = "in",
  OUT = "out",
}

@Entity()
export class InteractionChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  channelId: string;
  @OneToMany((type) => mChannel, (mChannel) => mChannel.id)
  @JoinColumn()
  channel: mChannel;

  @Column({ length: 50 })
  sessionId: string;

  @Column({ length: 100, nullable: true })
  convId: string;

  @Column({ length: 50 })
  from: string;

  @Column({ length: 50, nullable: true })
  fromName: string;

  @Column({ length: 5, default: "text" })
  messageType: string;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({ type: "text", nullable: true })
  media: string;

  @Column({ nullable: true })
  sendDate: Date;

  @Column({ default: false })
  sendStatus: Boolean;

  @Column({ type: "text", nullable: true })
  systemMessage: string;

  @Column({
    type: "enum",
    enum: ActionType,
    nullable: true,
  })
  actionType: ActionType;

  @Column({ nullable: true })
  ResponseTime: Number;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  agent: User;
}
