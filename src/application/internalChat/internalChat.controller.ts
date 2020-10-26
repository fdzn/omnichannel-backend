import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { InternalChatService } from "./internalChat.service";

//DTO
import { SendPost, GetChatPost } from "./dto/internalChat.dto";

@ApiBearerAuth()
@ApiTags("Internal Chat")
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
    const result = await this.internalChatService.send(postData, payload.user);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getChat/:to/:page")
  @HttpCode(200)
  async getChat(
    @Request() payload,
    @Param("to") to: string,
    @Param("page") page: number,
    @Res() res: Response
  ) {
    let params = new GetChatPost();
    params.page = page;
    params.to = to;
    const result = await this.internalChatService.getChat(params, payload.user);
    res.status(result.statusCode).send(result);
  }
}
