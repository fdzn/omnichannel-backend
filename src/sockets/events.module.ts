import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsGateway } from "./events.gateway";
import { LibsModule } from "../application/libs/libs.module";
import { InteractionHeader } from "../entity/interaction_header.entity";
@Module({
  imports: [TypeOrmModule.forFeature([InteractionHeader]), LibsModule],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
