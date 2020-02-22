import { Controller, Get, Post, Body } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { IncomingTelegram } from "./dto/incoming-telegram.dto";

@Controller("incoming/telegram")
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async create(@Body() createIncomingtelegram: IncomingTelegram) {
    return await this.telegramService.createIncoming(createIncomingtelegram);
  }
}
