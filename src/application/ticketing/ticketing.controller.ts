import {
  Controller,
  Post,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
  Get,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

import { TicketingService } from "./ticketing.service";
import {
  SubmitTicketPost,
  ListTicketPost,
  HistoryTicketGet,
} from "./dto/ticketing.dto";

@ApiBearerAuth()
@ApiTags("Ticketing")
@Controller("ticketing")
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}

  @UseGuards(JwtAuthGuard)
  @Post("submit")
  @HttpCode(200)
  async submit(
    @Request() payload,
    @Body() postData: SubmitTicketPost,
    @Res() res: Response
  ) {
    const result = await this.ticketingService.submitTicket(
      postData,
      payload.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("listTicket")
  @HttpCode(200)
  async listTicketPost(
    @Request() payload,
    @Body() postData: ListTicketPost,
    @Res() res: Response
  ) {
    const result = await this.ticketingService.getListTicketPost(
      postData,
      payload
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("history/:ticketId/:page/:limit")
  async history(@Param() params: HistoryTicketGet, @Res() res: Response) {
    const result = await this.ticketingService.historyTicket(params);
    res.status(result.statusCode).send(result);
    // res.status(200).send(params);
  }
}
