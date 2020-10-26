import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { AutoInService } from "./autoin.service";
import { AutoInController } from "./autoin.controller";

//ENTITY
import { User } from "../../entity/user.entity";
import { WorkOrder } from "../../entity/work_order.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, WorkOrder, InteractionHeader])],
  providers: [AutoInService],
  controllers: [AutoInController],
})
export class AutoInModule {}
