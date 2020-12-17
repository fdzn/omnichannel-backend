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
import { InteractionService } from "./interaction.service";

//DTO
import {
  pickupManualPost,
  pickupAutoPost,
  endPost,
  GetInteractionPost,
  loadWorkOrderPost,
  JourneyPost,
  IsAbandonPut,
} from "./dto/interaction.dto";

import { CwcPost } from "./dto/cwc.dto";

@ApiBearerAuth()
@ApiTags("Interaction")
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

  @Post("pickupBySession")
  @HttpCode(200)
  async pickupBySession(
    @Body() postData: pickupAutoPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.pickupBySession(postData);
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
    const result = await this.interactionService.submitCWC(
      postData,
      payload.user
    );
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
  @Get("getJourneyCustomer/:customerId/:page")
  @HttpCode(200)
  async loadJourney(
    @Param("customerId") customerId: number,
    @Param("page") page: number,
    @Res() res: Response
  ) {
    let params = new JourneyPost();
    params.customerId = customerId;
    params.page = page;
    const result = await this.interactionService.loadJourney(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getWorkOrder/:channelId")
  @HttpCode(200)
  async loadWorkOrderByChannel(
    @Param() params: loadWorkOrderPost,
    @Request() payload,
    @Res() res: Response
  ) {
    const result = await this.interactionService.loadWorkOrderByChannel(
      params,
      payload.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getWorkOrder")
  @HttpCode(200)
  async loadWorkOrder(@Request() payload, @Res() res: Response) {
    const result = await this.interactionService.loadWorkOrder(payload.user);
    res.status(result.statusCode).send(result);
  }

  @Post("updateAbandon")
  @HttpCode(200)
  async updateAbandon(@Body() postData: IsAbandonPut, @Res() res: Response) {
    const result = await this.interactionService.updateAbandon(postData);
    res.status(result.statusCode).send(result);
  }
}
