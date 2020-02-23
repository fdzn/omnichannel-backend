import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { generalChat } from "./templates/generalChat";
import { User } from "./user.entity";
@Entity()
export class interactionWhatsapp extends generalChat {
  @Column({ length: 20, nullable: true })
  agentUsername: number;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  agent: User;

  @Column({ length: 100, nullable: true })
  convId: string;
}
