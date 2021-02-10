import { Module } from "@nestjs/common";

//COMPONENT
import { MonitoringController } from "./monitoring.controller";
import { MonitoringService } from "./monitoring.service";

//MODULE
import { LibsModule } from "../libs/libs.module";

@Module({
  imports: [LibsModule],
  controllers: [MonitoringController],
  providers: [MonitoringService]
})
export class MonitoringModule {}
