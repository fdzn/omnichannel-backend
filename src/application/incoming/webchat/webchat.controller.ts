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
  async webchat(@Body() dataIncoming: any, @Res() res: Response) {
    console.log("WEBCHAT", JSON.stringify(dataIncoming));
    const resultParse = await this.webchatService.octopushChat(dataIncoming);
    if (resultParse.isError) {
      res.status(resultParse.statusCode).send(resultParse);
    } else {
      const result = await this.webchatService.incoming(resultParse.data);
      res.status(result.statusCode).send(result);
    }
  }
}
