import { Module } from "@nestjs/common";

import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { VideocallModule } from './videocall/videocall.module';
import { VoiceModule } from './voice/voice.module';

@Module({
  imports: [WhatsappModule, VideocallModule, VoiceModule],
})
export class IncomingModule {}
