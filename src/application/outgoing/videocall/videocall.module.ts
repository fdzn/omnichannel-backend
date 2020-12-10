import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LibsModule } from "../../libs/libs.module";

import { VideocallService } from "./videocall.service";
import { VideocallController } from "./videocall.controller";

//ENTITY
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
import { InteractionHeader } from "../../../entity/interaction_header.entity";
@Module({
  imports: [
    LibsModule,
    TypeOrmModule.forFeature([InteractionVideoCall, InteractionHeader]),
  ],
  providers: [VideocallService],
  controllers: [VideocallController],
})
export class VideocallModule {}
