import {
  Controller,
  Post,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { InternalChatService } from "./internalChat.service";

//DTO
import { SendPost, GetChatPost } from "./dto/internalChat.dto";

@Controller("internalChat")
export class InternalChatController {
  constructor(private readonly internalChatService: InternalChatService) {}
  @UseGuards(JwtAuthGuard)
  @Post("send")
  @HttpCode(201)
  async send(
    @Request() payload,
    @Body() postData: SendPost,
    @Res() res: Response
  ) {
    const result = await this.internalChatService.send(postData,payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("getChat")
  @HttpCode(200)
  async getChat(
    @Request() payload,
    @Body() postData: GetChatPost,
    @Res() res: Response
  ) {
    const result = await this.internalChatService.getChat(postData,payload);
    res.status(result.statusCode).send(result);
  }
}
