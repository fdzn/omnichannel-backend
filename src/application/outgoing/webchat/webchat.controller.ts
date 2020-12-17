import {
  Controller,
  Post,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";

//SERVICE
import { WebchatService } from "./webchat.service";

//DTO
import { OutgoingWebchat } from "./dto/outgoing-webchat.dto";

@ApiBearerAuth()
@ApiTags("Outgoing")
@Controller("outgoing/webchat")
export class WebchatController {
  constructor(private readonly webchatService: WebchatService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(200)
  async outgoing(
    @Request() userdata,
    @Body() payload: OutgoingWebchat,
    @Res() res: Response
  ) {
    console.log("OUTGOING Webchat", new Date(), JSON.stringify(payload));

    const resultSave = await this.webchatService.saveInteraction(
      payload,
      userdata.user
    );
    res.status(200).send(resultSave);

    await this.webchatService.octopushChat(payload, resultSave, userdata.user);
  }
}
