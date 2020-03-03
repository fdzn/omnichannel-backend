import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { AutoInService } from "./autoin.service";
import { AutoInController } from "./autoin.controller";

//ENTITY
import { User } from "../../entity/user.entity";
import { WorkOrder } from "../../entity/work_order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, WorkOrder])],
  providers: [AutoInService],
  controllers: [AutoInController]
})
export class AutoInModule {}
