import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WebchatService } from "./webchat.service";
import { WebchatController } from "./webchat.controller";

//MODULE
import { LibsModule } from "../../libs/libs.module";

//ENTITY
import { InteractionWebchat } from "../../../entity/interaction_webchat.entity";
@Module({
  imports: [TypeOrmModule.forFeature([InteractionWebchat]), LibsModule],
  providers: [WebchatService],
  controllers: [WebchatController],
})
export class WebchatModule {}
