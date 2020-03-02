import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//MODULE
import { LibsModule } from "../../libs/libs.module";

//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InteractionWhatsapp]), LibsModule],
  providers: [WhatsappService],
  controllers: [WhatsappController]
})
export class WhatsappModule {}
