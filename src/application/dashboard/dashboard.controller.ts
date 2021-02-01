import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { DashboardService } from "./dashboard.service";

//DTO
import {
  ParamGeneral,
  ParamLogInteraction,
  ParamTotalHandled,
  ParamGeneralLimit,
  ParamListQueue,
} from "./dto/dashboard.dto";

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
  @Get("art/:dateFrom/:dateTo/:channelId/:agentUsername")
  async art(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.art(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("scr/:dateFrom/:dateTo/:channelId/:agentUsername")
  async scr(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.scr(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("statusCall/:dateFrom/:dateTo/:channelId/:agentUsername")
  async statusCall(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.statusCall(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("logInteraction/:dateFrom/:dateTo/:channelId/:agentUsername/:page")
  async logInteraction(
    @Param() params: ParamLogInteraction,
    @Res() res: Response
  ) {
    const result = await this.dashboardService.logInteraction(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("totalHandledByChannel/:dateFrom/:dateTo/:agentUsername")
  async totalHandledByChannel(
    @Param() params: ParamTotalHandled,
    @Res() res: Response
  ) {
    const result = await this.dashboardService.totalHandledByChannel(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("sla/:dateFrom/:dateTo/:channelId/:agentUsername")
  async sla(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.sla(params);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("traffic/:dateFrom/:dateTo/:channelId/:agentUsername")
  async traffic(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.traffic(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("sentiment/:dateFrom/:dateTo/:channelId/:agentUsername")
  async sentiment(@Param() params: ParamGeneral, @Res() res: Response) {
    const result = await this.dashboardService.sentiment(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("listQueue/:channelId/:agentUsername/:page/:limit")
  async listQueue(@Param() params: ParamListQueue, @Res() res: Response) {
    const result = await this.dashboardService.listQueue(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("summaryCategory/:dateFrom/:dateTo/:channelId/:agentUsername/:limit")
  async summaryCategory(
    @Param() params: ParamGeneralLimit,
    @Res() res: Response
  ) {
    const result = await this.dashboardService.summaryCategory(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("summarySubCategory/:dateFrom/:dateTo/:channelId/:agentUsername/:limit")
  async summarySubCategory(
    @Param() params: ParamGeneralLimit,
    @Res() res: Response
  ) {
    const result = await this.dashboardService.summarySubCategory(params);
    res.status(result.statusCode).send(result);
  }
}
