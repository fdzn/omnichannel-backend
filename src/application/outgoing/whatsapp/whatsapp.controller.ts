import { Controller, Get, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICE
import { WhatsappService } from "./whatsapp.service";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";

@Controller("outgoing/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  @HttpCode(200)
  async outgoing(@Body() dataOutgoing: OutgoingWhatsapp, @Res() res: Response) {
    const result = await this.whatsappService.capiwha(dataOutgoing);
    res.status(result.statusCode).send(result);
  }

  @Get()
  async findAll() {
    let data = new OutgoingWhatsapp();
    data.from = "628981547873";
    data.message = "HAIII";
    const result = await this.whatsappService.capiwha(data);
  }
}
