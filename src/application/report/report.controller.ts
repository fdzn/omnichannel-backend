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
}
