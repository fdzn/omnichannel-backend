import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VideocallService } from "./videocall.service";
import { EventsGateway } from "../../../sockets/events.gateway";
import { VonagePost } from "./dto/incoming-videocall.dto";

@ApiTags("Incoming")
@Controller("incoming/videocall")
export class VideocallController {
  constructor(
    private readonly videocallService: VideocallService,
    private readonly eventsGateway: EventsGateway
  ) {}

  @Post("vonage")
  @HttpCode(201)
  async vonage(@Body() dataIncoming: VonagePost, @Res() res: Response) {
    console.log("VideoCall", new Date(), JSON.stringify(dataIncoming));
    const normalizeData = this.videocallService.vonage(dataIncoming);
    const result = await this.videocallService.incoming(normalizeData);
    res.status(result.statusCode).send(result);
  }
  @Post("test")
  @HttpCode(201)
  async test(@Body() dataIncoming: any, @Res() res: Response) {
    console.log("VideoCall Test", new Date(), JSON.stringify(dataIncoming));
    this.eventsGateway.sendData("agent", "newVideoCall", dataIncoming);
    // const result = await this.videocallService.vonage(dataIncoming);
    res.status(200).send(dataIncoming);
  }
}
