import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";

export enum ActionType {
  IN = "in",
  OUT = "out"
}

export abstract class generalChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  sessionId: string;

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

  @Column()
  sendDate: Date;

  @Column({
    type: "enum",
    enum: ActionType,
    nullable: true
  })
  actionType: ActionType;

  @Column({ nullable: true })
  ResponseTime: Number;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;
}
