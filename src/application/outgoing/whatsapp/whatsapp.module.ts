import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LibsModule } from "../../libs/libs.module";
//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";

@Module({
  imports: [LibsModule, TypeOrmModule.forFeature([InteractionWhatsapp])],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
