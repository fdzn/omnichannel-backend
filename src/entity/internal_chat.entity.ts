import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
export enum ActionType {
  IN = "in",
  OUT = "OUT",
}
@Entity()
export class InternalChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  room: string;

  @Column({ length: 20, nullable: true })
  fromUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  from: User;

  @Column({ length: 20, nullable: true })
  toUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  to: User;

  @Column({ length: 5, default: "text" })
  messageType: string;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({ type: "text", nullable: true })
  media: string;

  @Column()
  sendDate: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;
}
