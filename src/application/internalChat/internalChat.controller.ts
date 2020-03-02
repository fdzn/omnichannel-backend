import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { InternalChatService } from "./internalChat.service";

//DTO
import { SendPost, GetChatPost } from "./dto/internalChat.dto";

@Controller("internalChat")
export class InternalChatController {
  constructor(private readonly internalChatService: InternalChatService) {}

  @Post("send")
  @HttpCode(201)
  async send(@Body() postData: SendPost, @Res() res: Response) {
    const result = await this.internalChatService.send(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("getChat")
  @HttpCode(200)
  async getChat(@Body() postData: GetChatPost, @Res() res: Response) {
    const result = await this.internalChatService.getChat(postData);
    res.status(result.statusCode).send(result);
  }
}
