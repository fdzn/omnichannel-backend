import { Module } from "@nestjs/common";

import { VideocallController } from "./videocall.controller";
import { VideocallService } from "./videocall.service";
import { EventsModule } from "../../../sockets/events.module";
//MODULE
import { HeaderModule } from "../../header/header.module";
import { LibsModule } from "../../libs/libs.module";

@Module({
  imports: [LibsModule, EventsModule, HeaderModule],
  controllers: [VideocallController],
  providers: [VideocallService],
})
export class VideocallModule {}
