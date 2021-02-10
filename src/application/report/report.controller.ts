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
import { ReportService } from "./report.service";

//DTO
import { GeneralTablePost, InteractionDetailPost } from "./dto/report.dto";

@ApiBearerAuth()
@ApiTags("Report")
@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get("getDashboardSummaryAgent")
  @HttpCode(200)
  async getDashboardSummaryAgent(@Request() payload, @Res() res: Response) {
    const result = await this.reportService.getDashboardSummaryAgent(
      payload.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("agentLog")
  @HttpCode(200)
  async getAgentLog(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.reportService.getAgentLog(payload);
    res.status(result.statusCode).send(result);
  }

  @Post("interaction")
  @HttpCode(200)
  async getInteraction(
    @Body() payload: GeneralTablePost,
    @Res() res: Response
  ) {
    const result = await this.reportService.getInteraction(payload);
    res.status(result.statusCode).send(result);
  }

  @Post("interactionDetail")
  @HttpCode(200)
  async getInteractionDetail(
    @Body() payload: InteractionDetailPost,
    @Res() res: Response
  ) {
    const result = await this.reportService.getInteractionDetail(payload);
    res.status(result.statusCode).send(result);
  }

  @Post("performanceAgent")
  @HttpCode(200)
  async performanceAgent(
    @Body() payload: GeneralTablePost,
    @Res() res: Response
  ) {
    const result = await this.reportService.getPerformanceAgent(payload);
    res.status(result.statusCode).send(result);
  }
  @Post("reportTraffic")
  @HttpCode(200)
  async reportTraffic(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.reportService.getReportTraffic(payload);
    res.status(result.statusCode).send(result);
  }
}
