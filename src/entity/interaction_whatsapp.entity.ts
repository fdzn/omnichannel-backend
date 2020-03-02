import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { generalChat } from "./templates/generalChat";
import { User } from "./user.entity";
@Entity()
export class InteractionWhatsapp extends generalChat {
  @Column({ length: 20, nullable: true })
  agentUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  agent: User;

  @Column({ length: 100, nullable: true })
  convId: string;
}
