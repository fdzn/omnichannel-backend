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

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
//SERVICES
import { InteractionService } from "./interaction.service";

//DTO
import {
  pickupManualPost,
  endPost,
  GetInteractionPost,
  loadWorkOrderPost,
  JourneyPost,
} from "./dto/interaction.dto";

import { CwcPost } from "./dto/cwc.dto";

@Controller("interaction")
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @UseGuards(JwtAuthGuard)
  @Post("pickup")
  @HttpCode(200)
  async pickupManual(
    @Request() payload,
    @Body() postData: pickupManualPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.pickupManual(
      postData,
      payload
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("end")
  @HttpCode(200)
  async endInteraction(
    @Request() payload,
    @Body() postData: endPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.endSession(postData, payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("submitCWC")
  @HttpCode(200)
  async submitCWC(
    @Request() payload,
    @Body() postData: CwcPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.submitCWC(postData, payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getInteraction/:channelId/:type/:sessionId")
  @HttpCode(200)
  async getInteraction(
    @Param() params: GetInteractionPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.getInteraction(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("loadJourney")
  @HttpCode(200)
  async loadJourney(@Body() postData: JourneyPost, @Res() res: Response) {
    const result = await this.interactionService.loadJourney(postData);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("loadWorkOrder/:channelId")
  @HttpCode(200)
  async loadWorkOrder(
    @Param() params: loadWorkOrderPost,
    @Request() payload,
    @Res() res: Response
  ) {
    console.log(payload);
    const result = await this.interactionService.loadWorkOrder(
      params,
      payload.user
    );
    res.status(result.statusCode).send(result);
  }
}
