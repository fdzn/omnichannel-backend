import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { AutoInService } from "./autoin.service";

//DTO
import { UpdateAuxPost, UpdateWorkOrderPost } from "./dto/autoin.dto";

@Controller("autoin")
export class AutoInController {
  constructor(private readonly autoinhService: AutoInService) {}

  @Post("updateAux")
  @HttpCode(200)
  async updateAux(@Body() postData: UpdateAuxPost, @Res() res: Response) {
    const result = await this.autoinhService.updateAuxStatus(postData);
    res.status(result.statusCode).send(result);
  }

  @Post("updateWorkOrder")
  @HttpCode(200)
  async updateWorkOrder(
    @Body() postData: UpdateWorkOrderPost,
    @Res() res: Response
  ) {
    const result = await this.autoinhService.updateWorkOrder(postData);
    res.status(result.statusCode).send(result);
  }
}
