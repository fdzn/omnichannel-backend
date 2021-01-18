import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
 
@Entity()
export class mTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "tinyint" })
  order: number;

  @Column({ length: 20, nullable: false })
  template_type: string;

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
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  updater: User;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;
}
