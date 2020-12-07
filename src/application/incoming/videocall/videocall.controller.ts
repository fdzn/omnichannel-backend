import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VideocallService } from "./videocall.service";
import { EventsGateway } from "../../../sockets/events.gateway";
import { IncomingVideoCall } from "./dto/incoming-videocall.dto";
@Controller("incoming/videocall")
export class VideocallController {
  constructor(
    private readonly videocallService: VideocallService,
    private readonly eventsGateway: EventsGateway
  ) {}
  @ApiTags("Incoming")
  // @Post("vonage")
  // @HttpCode(201)
  // async vonage(@Body() dataIncoming: IncomingVideoCall, @Res() res: Response) {
  //   console.log("VideoCall", JSON.stringify(dataIncoming));
  //   const result = await this.videocallService.vonage(dataIncoming);
  //   res.status(result.statusCode).send(result);
  // }
  @Post("test")
  @HttpCode(201)
  async test(@Body() dataIncoming: any, @Res() res: Response) {
    console.log("VideoCall", JSON.stringify(dataIncoming));
    this.eventsGateway.sendData("agent", "newVideoCall", dataIncoming);
    // const result = await this.videocallService.vonage(dataIncoming);
    res.status(200).send(dataIncoming);
  }
}
