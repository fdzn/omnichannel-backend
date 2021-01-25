import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LibsModule } from "../../libs/libs.module";
import { HeaderModule } from "../../header/header.module";

//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";

@Module({
  imports: [
    LibsModule,
    HeaderModule,
    TypeOrmModule.forFeature([InteractionChat]),
  ],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
