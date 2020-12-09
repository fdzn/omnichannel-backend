import { Module } from "@nestjs/common";

import { VoiceController } from "./voice.controller";
import { VoiceService } from "./voice.service";

//MODULE
import { LibsModule } from "../../libs/libs.module";
@Module({
  imports: [LibsModule],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
