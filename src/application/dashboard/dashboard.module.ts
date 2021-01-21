import { Module } from "@nestjs/common";

import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

//MODULE
import { LibsModule } from "../libs/libs.module";

@Module({
  imports: [LibsModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
