import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WebchatService } from "./webchat.service";
import { WebchatController } from "./webchat.controller";

//MODULE
import { LibsModule } from "../../libs/libs.module";
import { MinioNestModule } from "../../../minio/minio.module";

//ENTITY
import { InteractionWebchat } from "../../../entity/interaction_webchat.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([InteractionWebchat]),
    LibsModule,
    MinioNestModule,
  ],
  providers: [WebchatService],
  controllers: [WebchatController],
})
export class WebchatModule {}
