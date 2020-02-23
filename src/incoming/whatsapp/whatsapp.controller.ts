import { Controller, Get, Post, Body } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";

@Controller("incoming/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async create(@Body() createIncomingWhatsapp: IncomingWhatsapp) {
    return await this.whatsappService.createIncoming(createIncomingWhatsapp);
  }

  @Get()
  findAll(): object {
    return this.whatsappService.test();;
  }
}
