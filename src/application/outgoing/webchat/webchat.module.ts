import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LibsModule } from "../../libs/libs.module";

import { WebchatService } from "./webchat.service";
import { WebchatController } from "./webchat.controller";

//ENTITY
import { InteractionWebchat } from "../../../entity/interaction_webchat.entity";
@Module({
  imports: [LibsModule, TypeOrmModule.forFeature([InteractionWebchat])],
  providers: [WebchatService],
  controllers: [WebchatController],
})
export class WebchatModule {}
