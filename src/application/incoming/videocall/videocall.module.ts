import { Module } from "@nestjs/common";
import { VideocallController } from "./videocall.controller";
import { VideocallService } from "./videocall.service";
import { EventsModule } from "../../../sockets/events.module";
//MODULE
import { LibsModule } from "../../libs/libs.module";

@Module({
  imports: [LibsModule, EventsModule],
  controllers: [VideocallController],
  providers: [VideocallService],
})
export class VideocallModule {}
