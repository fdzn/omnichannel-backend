import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

//MODULE
import { LibsModule } from "../libs/libs.module";

//ENTITY
import { AgentLog } from "../../entity/agent_log.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { Customer } from "../../entity/customer.entity";
import { mChannel } from "../../entity/m_channel.entity";
import { Cwc } from "../../entity/cwc.entity";
import { User } from "../../entity/user.entity";
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentLog,
      InteractionHeaderHistory,
      // Customer,
      // mChannel,
      // Cwc,
      // User,
      // mCategory,
      // mSubCategory
    ]),
    LibsModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
