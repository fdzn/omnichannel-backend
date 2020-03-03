import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";
import { WhatsappService } from "./whatsapp.service";
import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";

@Controller("incoming/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  @HttpCode(201)
  async incoming(@Body() dataIncoming: IncomingWhatsapp, @Res() res: Response) {
    const result = await this.whatsappService.createIncoming(dataIncoming);
    res.status(result.statusCode).send(result);
  }

  @Post("capiwha")
  @HttpCode(200)
  async capiwha(@Body() dataIncoming, @Res() res: Response) {
    const result = await this.whatsappService.capiwha(dataIncoming);
    res.status(200).send(result);
  }
}
