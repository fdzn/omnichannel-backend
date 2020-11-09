import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
//MODULE
import { LibsModule } from "../libs/libs.module";
@Module({
  imports: [LibsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
