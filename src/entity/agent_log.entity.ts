import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AgentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  username: string;

  @Column({ length: 100, nullable: false })
  reason: string;

  @Column({ length: 100, nullable: true })
  logoutReason: string;

  @Column({ length: 100, nullable: true })
  info: string;

  @Column({ nullable: false })
  timeStart: Date;

  @Column({ nullable: true })
  timeEnd: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @Column({ length: 20, nullable: true })
  updater: string;
}
