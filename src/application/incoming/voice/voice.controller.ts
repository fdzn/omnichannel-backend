import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VoiceService } from "./voice.service";
import { AsteriskPost } from "./dto/incoming-voice.dto";

@ApiTags("Incoming")
@Controller("incoming/voice")
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post("asterisk")
  @HttpCode(201)
  async vonage(@Body() dataIncoming: AsteriskPost, @Res() res: Response) {
    console.log("Voice Asterisk", new Date(), JSON.stringify(dataIncoming));
    const normalizeData = this.voiceService.asterisk(dataIncoming);
    console.log("NORMALIZE", normalizeData);

    const result = await this.voiceService.incoming(normalizeData);
    res.status(result.statusCode).send(result);
  }
}
