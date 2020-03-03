import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

//ENTITY
import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { WorkOrder } from "../../entity/work_order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, mGroupSkill, InteractionHeader, WorkOrder])
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
