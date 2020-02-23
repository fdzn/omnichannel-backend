import { Module } from "@nestjs/common";

// import { TelegramModule } from "./telegram/telegram.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";

@Module({
  imports: [WhatsappModule]
})
export class IncomingModule {}
