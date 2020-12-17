import { Module } from "@nestjs/common";

import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { VideocallModule } from "./videocall/videocall.module";
import { WebchatModule } from "./webchat/webchat.module";

@Module({
  imports: [WhatsappModule, VideocallModule, WebchatModule],
})
export class OutgoingModule {}
