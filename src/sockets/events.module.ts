import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsGateway } from "./events.gateway";
import { InteractionHeader } from "../entity/interaction_header.entity";
@Module({
  imports: [TypeOrmModule.forFeature([InteractionHeader])],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
