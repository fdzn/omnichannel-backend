import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { generalMaster } from "./templates/generalMaster";
import { User } from "./user.entity";
@Entity()
export class mGroup extends generalMaster {
  @Column({ length: 20, nullable: true })
  updaterUsername: string;
  @ManyToOne(
    type => User,
    user => user.username
  )
  @JoinColumn()
  updater: User;
}
