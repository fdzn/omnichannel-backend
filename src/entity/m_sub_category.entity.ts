import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { generalMaster } from "./templates/generalMaster";

import { User } from "./user.entity";
import { mCategory } from "./m_category.entity";
@Entity()
export class mSubCategory extends generalMaster {
  @Column({ nullable: true })
  categoryId: number;
  @ManyToOne((type) => mCategory, (m_category) => m_category.id)
  @JoinColumn()
  category: mCategory;

  @Column({ length: 20, nullable: true })
  updaterUsername: string;
  @ManyToOne((type) => User, (user) => user.username)
  @JoinColumn()
  updater: User;
}
