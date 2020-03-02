import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { Cwc } from "../../entity/cwc.entity";

//MODULE
import { LibsModule } from "../libs/libs.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InteractionHeader,
      InteractionHeaderHistory,
      Cwc
    ]),
    LibsModule
  ],
  providers: [InteractionService],
  controllers: [InteractionController]
})
export class InteractionModule {}
