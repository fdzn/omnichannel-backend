import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum ActionType {
  IN = "in",
  OUT = "out",
}

@Entity()
export class InteractionVideoCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  sessionId: string;

  @Column({ length: 100 })
  from: string;

  @Column({ length: 100, nullable: true })
  fromName: string;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({
    type: "enum",
    enum: ActionType,
    nullable: true,
  })
  actionType: ActionType;

  @Column({ length: 100 })
  sessionVideo: string;

  @Column({ length: 100 })
  roomId: string;

  @Column({ length: 100 })
  apiKey: string;

  @Column({ type: "text" })
  token: string;

  @Column({ length: 20 })
  library: string;

  @Column({ length: 20 })
  socketId: string;

  @Column({ nullable: true })
  sendDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  agent: User;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;
}
