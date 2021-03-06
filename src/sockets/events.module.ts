import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsGateway } from "./events.gateway";

//MODULE
import { LibsModule } from "../application/libs/libs.module";

//ENTITY
import { InteractionHeader } from "../entity/interaction_header.entity";
import { User } from "../entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InteractionHeader, User]), LibsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
