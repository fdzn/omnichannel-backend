import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

//MODULE
import { LibsModule } from "../libs/libs.module";

//ENTITY
import { AgentLog } from "../../entity/agent_log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AgentLog]), LibsModule],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
