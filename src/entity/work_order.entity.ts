import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { mGroupSkill } from "./m_group_skill.entity";
import { User } from "./user.entity";
@Entity()
export class workOrder extends mGroupSkill {
  @Column({ type: "smallint", default: 1 })
  limit: number;

  @Column({ type: "smallint", default: 0 })
  slot: number;

  @Column({ nullable: true })
  lastDist: Date;
}
