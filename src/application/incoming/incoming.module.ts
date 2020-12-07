import { Module } from "@nestjs/common";

import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { VideocallModule } from './videocall/videocall.module';

@Module({
  imports: [WhatsappModule, VideocallModule],
})
export class IncomingModule {}
