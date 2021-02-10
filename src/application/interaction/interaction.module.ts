import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { Cwc } from "../../entity/cwc.entity";
import { WorkOrder } from "../../entity/work_order.entity";

//MODULE
import { LibsModule } from "../libs/libs.module";
import { TicketingModule } from "../ticketing/ticketing.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InteractionHeader,
      InteractionHeaderHistory,
      Cwc,
      WorkOrder,
    ]),
    LibsModule,
    TicketingModule,
  ],
  providers: [InteractionService],
  controllers: [InteractionController],
})
export class InteractionModule {}
