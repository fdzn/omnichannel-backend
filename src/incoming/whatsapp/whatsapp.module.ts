import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";
import { LibsModule } from "../../libs/libs.module";
import { interactionWhatsapp } from "../../entity/interaction_whatsapp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([interactionWhatsapp]), LibsModule],
  providers: [WhatsappService],
  controllers: [WhatsappController]
})
export class WhatsappModule {}
