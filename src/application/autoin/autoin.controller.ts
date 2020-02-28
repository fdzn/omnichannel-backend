import { Controller, Get, Post, Res, Body } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { AutoInService } from "./autoin.service";

//DTO
import { UpdateAuxPost, UpdateWorkOrderPost } from "./dto/autoin.dto";
// import { AuthLogout } from "./dto/auth-logout.dto";

@Controller("autoin")
export class AutoInController {
  constructor(private readonly autoinhService: AutoInService) {}

  @Post("updateAux")
  async updateAux(@Body() userData: UpdateAuxPost, @Res() res: Response) {
    const result = await this.autoinhService.updateAuxStatus(userData);
    res.status(result.statusCode).send(result);
  }

  @Post("updateWorkOrder")
  async updateWorkOrder(
    @Body() userData: UpdateWorkOrderPost,
    @Res() res: Response
  ) {
    const result = await this.autoinhService.updateWorkOrder(userData);
    res.status(result.statusCode).send(result);
  }
}
