import { Module } from "@nestjs/common";

import { VoiceController } from "./voice.controller";
import { VoiceService } from "./voice.service";

//MODULE
import { HeaderModule } from "../../header/header.module";

@Module({
  imports: [HeaderModule],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
