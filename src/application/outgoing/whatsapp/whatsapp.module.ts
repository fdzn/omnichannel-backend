import { Module, HttpModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InteractionWhatsapp]), HttpModule],
  providers: [WhatsappService],
  controllers: [WhatsappController]
})
export class WhatsappModule {}
