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
import { DashboardService } from "./dashboard.service";

//DTO
import { ParamGeneral } from "./dto/dashboard.dto";
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

//   @UseGuards(JwtAuthGuard)
  @Get("all/:dateTo/:dateFrom/:username")
  async deposito(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.getData(params);
    res.status(result.statusCode).send(result);
  }
}
