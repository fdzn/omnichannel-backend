import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { DashboardService } from "./dashboard.service";

//DTO
import { ParamGeneral } from "./dto/dashboard.dto";

@ApiBearerAuth()
@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get("all/:dateFrom/:dateTo/:channelId/:agentUsername")
  async dashboardAll(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.getData(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("caseIn/:dateFrom/:dateTo/:channelId/:agentUsername")
  async caseIn(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.caseIn(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("offered/:dateFrom/:dateTo/:channelId/:agentUsername")
  async offered(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.offered(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("totalQueue")
  async totalQueue(@Res() res: Response) {
    const result = await this.dashboardService.totalQueue();
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("aht/:dateFrom/:dateTo/:channelId/:agentUsername")
  async aht(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.aht(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("traffic/:dateFrom/:dateTo/:channelId/:agentUsername")
  async traffic(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.traffic(params);
    res.status(result.statusCode).send(result);
  }
}
