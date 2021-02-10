import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity";
import { mTicketStatus } from "./m_ticket_status.entity";
import { Ticket } from "./ticket.entity";

@Entity()
export class TicketHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ticketId: string;
  @ManyToOne((type) => Ticket, (Ticket) => Ticket.id)
  @JoinColumn()
  ticket: Ticket;
  
  @Column({ nullable: true })
  statusId: string;
  @ManyToOne((type) => mTicketStatus, (mTicketStatus) => mTicketStatus.id)
  @JoinColumn()
  status: mTicketStatus;

  @Column({ type: "text" })
  notes: string;
  
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
