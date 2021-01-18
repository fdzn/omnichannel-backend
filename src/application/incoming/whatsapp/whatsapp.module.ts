import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//MODULE
import { LibsModule } from "../../libs/libs.module";
import { MinioNestModule } from "../../../minio/minio.module";

//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([InteractionChat]),
    LibsModule,
    MinioNestModule,
  ],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
