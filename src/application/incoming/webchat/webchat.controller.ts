import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { WebchatService } from "./webchat.service";
import { IncomingWebchat } from "./dto/incoming-webchat.dto";

@ApiTags("Incoming")
@Controller("incoming/webchat")
export class WebchatController {
  constructor(private readonly webchatService: WebchatService) {}

  @Post()
  @HttpCode(201)
  async capiwha(@Body() dataIncoming: any, @Res() res: Response) {
    console.log("WEBCHAT", JSON.stringify(dataIncoming));
    const normalizationData = await this.webchatService.octopushChat(
      dataIncoming
    );
    if (normalizationData) {
      const result = await this.webchatService.incoming(normalizationData);
      res.status(result.statusCode).send(result);
    } else {
      res.status(500).send("Undefined Type Data");
    }
  }
}
