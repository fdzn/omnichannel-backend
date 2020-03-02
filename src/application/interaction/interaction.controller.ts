import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { InteractionService } from "./interaction.service";

//DTO
import {
  pickupManualPost,
  pickupAutoPost,
  endPost,
  GetInteractionPost,
  loadWorkOrderPost,
  GetInteractionSpecific,
  JourneyPost
} from "./dto/interaction.dto";

import { CwcPost } from "./dto/cwc.dto";

@Controller("interaction")
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post("pickup")
  @HttpCode(200)
  async pickupManual(@Body() postData: pickupManualPost, @Res() res: Response) {
    const result = await this.interactionService.pickupManual(postData);
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

  @Post("end")
  @HttpCode(200)
  async endInteraction(@Body() postData: endPost, @Res() res: Response) {
    const result = await this.interactionService.endSession(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("submitCWC")
  @HttpCode(200)
  async submitCWC(@Body() postData: CwcPost, @Res() res: Response) {
    const result = await this.interactionService.submitCWC(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("getInteractionWhatsapp")
  @HttpCode(200)
  async getInteractionWhatsapp(
    @Body() postData: GetInteractionSpecific,
    @Res() res: Response
  ) {
    const result = await this.interactionService.getInteractionWhatsapp(
      postData
    );
    res.status(result.statusCode).send(result);
  }

  @Post("getInteraction")
  @HttpCode(200)
  async getInteraction(
    @Body() postData: GetInteractionPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.getInteraction(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("loadJourney")
  @HttpCode(200)
  async loadJourney(@Body() postData: JourneyPost, @Res() res: Response) {
    const result = await this.interactionService.loadJourney(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("loadWorkOrder")
  @HttpCode(200)
  async loadWorkOrder(
    @Body() postData: loadWorkOrderPost,
    @Res() res: Response
  ) {
    const result = await this.interactionService.loadWorkOrder(postData);
    res.status(result.statusCode).send(result);
  }
}
