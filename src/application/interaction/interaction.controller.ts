import { Controller, Get, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { InteractionService } from "./interaction.service";

//DTO
import { pickupManualPost, pickupAutoPost,endPost } from "./dto/interaction.dto";
// import { AuthLogout } from "./dto/auth-logout.dto";

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
}
