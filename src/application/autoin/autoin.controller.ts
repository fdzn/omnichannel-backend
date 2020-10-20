import {
  Controller,
  Post,
  Put,
  Res,
  Body,
  HttpCode,
  UseGuards,
  Request,
} from "@nestjs/common";
import { Response } from "express";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { AutoInService } from "./autoin.service";

//DTO
import {
  UpdateAuxPost,
  UpdateWorkOrderPost,
  PickupPost,
} from "./dto/autoin.dto";

@Controller("autoin")
export class AutoInController {
  constructor(private readonly autoinService: AutoInService) {}

  @UseGuards(JwtAuthGuard)
  @Put("updateAux")
  @HttpCode(200)
  async updateAux(
    @Request() payload,
    @Body() postData: UpdateAuxPost,
    @Res() res: Response
  ) {
    const result = await this.autoinService.updateAuxStatus(
      postData,
      payload.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("updateWorkOrder")
  @HttpCode(200)
  async updateWorkOrder(
    @Body() postData: UpdateWorkOrderPost,
    @Res() res: Response
  ) {
    const result = await this.autoinService.updateWorkOrder(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("pickup")
  @HttpCode(200)
  async pickup(@Body() postData: PickupPost, @Res() res: Response) {
    const result = await this.autoinService.pickup(postData);
    res.status(result.statusCode).send(result);
  }
}
