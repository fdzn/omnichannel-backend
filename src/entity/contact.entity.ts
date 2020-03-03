import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { Customer } from "./customer.entity";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customerId: number;
  @ManyToOne(
    type => Customer,
    customer => customer.id
  )
  @JoinColumn()
  customer: Customer;

  @Column({ length: 20 })
  type: string;

  @Column({ length: 100 })
  value: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;
}
