import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { mUnit } from "./m_unit.entity";
import { mGroup } from "./m_group.entity";
export enum UserLevel {
  ADMIN = "admin",
  AGENT = "agent",
  SUPERVISOR = "supervisor",
  BACKROOM = "backroom"
}

@Entity()
export class User {
  @Column({ primary: true, length: 20, unique: true })
  username: string;

  @Column({ length: 60 })
  password: string;

  @Column({
    type: "enum",
    enum: UserLevel,
    default: UserLevel.AGENT
  })
  level: UserLevel;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column()
  avatar: string;

  @Column({ length: 20, nullable: true })
  hostPBX: string;

  @Column({ length: 6, nullable: true })
  loginPBX: string;

  @Column({ length: 100, nullable: true })
  passwordPBX: string;

  @Column({ nullable: true })
  unitId: number;
  @ManyToOne(
    type => mUnit,
    m_unit => m_unit.id
  )
  @JoinColumn()
  unit: mUnit;

  @Column({ nullable: true })
  groupId: number;
  @ManyToOne(
    type => mGroup,
    m_group => m_group.id
  )
  @JoinColumn()
  group: mGroup;

  @Column({
    default: false
  })
  socketStatus: boolean;

  @Column({
    default: false
  })
  isLogin: boolean;

  @Column({
    default: false
  })
  isAux: boolean;

  @Column({
    default: false
  })
  isAuxPhone: boolean;

  @Column({
    default: true
  })
  isActive: boolean;

  @Column({
    default: false
  })
  isDeleted: boolean;

  @Column({ length: 20 })
  updater: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
