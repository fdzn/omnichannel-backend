import { Module } from "@nestjs/common";

import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { VideocallModule } from "./videocall/videocall.module";
import { VoiceModule } from "./voice/voice.module";
import { WebchatModule } from './webchat/webchat.module';

@Module({
  imports: [WhatsappModule, VideocallModule, VoiceModule, WebchatModule],
})
export class IncomingModule {}
