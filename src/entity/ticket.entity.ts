import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./user.entity";
import { mTicketStatus } from "./m_ticket_status.entity";
import { mUnit } from "./m_unit.entity";

export enum TicketAction {
  FCR = "FCR",
  NFCR = "NFCR",
}

@Entity()
export class Ticket {
  @Column({
    primary: true,
    length: 20,
  })
  id: string;

  @Column({
    nullable: true,
    length: 50,
  })
  subject: string;

  @Column({
    default: false,
  })
  priority: boolean;

  @Column({
    type: "enum",
    enum: TicketAction,
    default: TicketAction.NFCR,
  })
  action: TicketAction;

  @Column({ default: 1 })
  statusId: number;
  @ManyToOne((type) => mTicketStatus, (mTicketStatus) => mTicketStatus.id)
  @JoinColumn()
  status: mTicketStatus;

  @Column({ nullable: true })
  unitId: number;
  @ManyToOne((type) => mUnit, (mUnit) => mUnit.id)
  @JoinColumn()
  unit: mUnit;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ length: 20, nullable: true })
  creatorUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  creator: User;

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
