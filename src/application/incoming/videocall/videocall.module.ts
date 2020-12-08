import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VideocallController } from "./videocall.controller";
import { VideocallService } from "./videocall.service";
import { EventsModule } from "../../../sockets/events.module";
//MODULE
import { LibsModule } from "../../libs/libs.module";

//ENTITY
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([InteractionVideoCall]),
    LibsModule,
    EventsModule,
  ],
  controllers: [VideocallController],
  providers: [VideocallService],
})
export class VideocallModule {}
