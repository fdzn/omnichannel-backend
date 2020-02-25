import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
// import { LibsModule } from "../../libs/libs.module";
import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, mGroupSkill, InteractionHeader])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
