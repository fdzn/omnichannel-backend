import { Controller, Get, Post, Res, Body } from "@nestjs/common";
import { Response } from "express";
import { WhatsappService } from "./whatsapp.service";
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";

@Controller("outgoing/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async outgoing(@Body() dataOutgoing: OutgoingWhatsapp, @Res() res: Response) {
    const result = await this.whatsappService.createOutgoing(dataOutgoing);
    res.status(result.statusCode).send(result);
  }
}
