import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

//SERVICE
import { VideocallService } from "./videocall.service";

//DTO
import { OutgoingVideoCall } from "./dto/outgoing-videocall.dto";

@ApiBearerAuth()
@ApiTags("Outgoing")
@Controller("outgoing/videocall")
export class VideocallController {
  constructor(private readonly videocallService: VideocallService) {}

  @Post()
  @HttpCode(200)
  async outgoing(@Body() dataPost: OutgoingVideoCall, @Res() res: Response) {
    console.log("OUTGOING VIDEO CALL", new Date(), JSON.stringify(dataPost));

    const resultSave = await this.videocallService.vonage(dataPost);
    res.status(200).send(resultSave);
  }
}
