import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { Cwc } from "../../entity/cwc.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InteractionHeader, Cwc])],
  providers: [InteractionService],
  controllers: [InteractionController]
})
export class InteractionModule {}
