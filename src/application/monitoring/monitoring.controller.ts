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
import { MonitoringService } from "./monitoring.service";

//DTO
import { GeneralTablePost, WorkOrder } from "./dto/monitoring.dto";

@ApiBearerAuth()
@ApiTags("Monitoring")
@Controller("monitoring")
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get("getAgentOnline")
  @HttpCode(200)
  async getAgentOnline(@Res() res: Response) {
    const result = await this.monitoringService.getAgentOnline();
    res.status(result.statusCode).send(result);
  }

  @Get("getAgentSession")
  @HttpCode(200)
  async getAgentSession(@Res() res: Response) {
    const result = await this.monitoringService.getAgentSession();
    res.status(result.statusCode).send(result);
  }

  @Get("getWorkOrder/:channelId")
  @HttpCode(200)
  async getWorkOrder(@Param() params: WorkOrder, @Res() res: Response) {
    const result = await this.monitoringService.getWorkOrder(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get("getDashboardSummaryAgent")
  // @HttpCode(200)
  // async getDashboardSummaryAgent(@Request() payload, @Res() res: Response) {
  //   const result = await this.monitoringService.getDashboardSummaryAgent(
  //     payload.user
  //   );
  //   res.status(result.statusCode).send(result);
  // }

  // @Post("agentLog")
  // @HttpCode(200)
  // async getAgentLog(@Body() payload: GeneralTablePost, @Res() res: Response) {
  //   const result = await this.monitoringService.getAgentLog(payload);
  //   res.status(result.statusCode).send(result);
  // }

  // @Post("interaction")
  // @HttpCode(200)
  // async getInteraction(
  //   @Body() payload: GeneralTablePost,
  //   @Res() res: Response
  // ) {
  //   const result = await this.monitoringService.getInteraction(payload);
  //   res.status(result.statusCode).send(result);
  // }

  // @Post("interactionDetail")
  // @HttpCode(200)
  // async getInteractionDetail(@Body() payload, @Res() res: Response) {
  //   const result = await this.monitoringService.getInteractionDetail(payload);
  //   res.status(result.statusCode).send(result);
  // }

  // @Post("performanceAgent")
  // @HttpCode(200)
  // async performanceAgent(
  //   @Body() payload: GeneralTablePost,
  //   @Res() res: Response
  // ) {
  //   const result = await this.monitoringService.getPerformanceAgent(payload);
  //   res.status(result.statusCode).send(result);
  // }

  // @Post("reportTraffic")
  // @HttpCode(200)
  // async reportTraffic(@Body() payload: GeneralTablePost, @Res() res: Response) {
  //   const result = await this.monitoringService.getReportTraffic(payload);
  //   res.status(result.statusCode).send(result);
  // }
}
