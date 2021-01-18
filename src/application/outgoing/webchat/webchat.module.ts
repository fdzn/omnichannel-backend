import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LibsModule } from "../../libs/libs.module";

import { WebchatService } from "./webchat.service";
import { WebchatController } from "./webchat.controller";

//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";
@Module({
  imports: [LibsModule, TypeOrmModule.forFeature([InteractionChat])],
  providers: [WebchatService],
  controllers: [WebchatController],
})
export class WebchatModule {}
