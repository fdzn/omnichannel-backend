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

export enum CustomerGender {
  MALE = "male",
  FEMALE = "female"
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({
    type: "enum",
    enum: CustomerGender,
    nullable: true
  })
  gender: string;

  @Column({ length: 70, nullable: true })
  address: string;

  @Column({ length: 70, nullable: true })
  city: string;

  @Column({ length: 70, nullable: true })
  company: string;

  @Column({ type: "smallint", default: 0 })
  priority: number;

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
