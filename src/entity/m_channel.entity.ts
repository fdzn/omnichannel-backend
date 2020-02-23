import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class mChannel {
  @Column({ primary: true, length: 11, unique: true })
  id: string;

  @Column({ length: 2 })
  code: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  icon: string;

  @Column({ length: 50 })
  tableLog: string;

  @Column({ length: 70 })
  tableHist: string;

  @Column({ type: "tinyint", default: 1 })
  order: number;

  @Column({
    default: true
  })
  isActive: boolean;

  @Column({
    default: false
  })
  isDeleted: boolean;

  @Column({ length: 20, nullable: true })
  updaterUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  updater: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
