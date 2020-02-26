import { Controller, Get, Post, Res, Body } from "@nestjs/common";
import { Response } from "express";
import { WhatsappService } from "./whatsapp.service";
import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";

@Controller("incoming/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async incoming(@Body() dataIncoming: IncomingWhatsapp, @Res() res: Response) {
    const result = await this.whatsappService.createIncoming(dataIncoming);
    res.status(result.statusCode).send(result);
  }

  // @Get()
  // findAll(): object {
  //   return this.whatsappService.test();
  // }
}
