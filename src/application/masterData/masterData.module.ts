import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { MasterDataController } from "./masterData.controller";
import { MasterDataService } from "./masterData.service";

//ENTITY
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";
import { mTemplate } from "../../entity/m_template.entity";
import { WorkOrder } from "../../entity/work_order.entity";
import { mGroup } from "../../entity/m_group.entity";
import { User } from "../../entity/user.entity";
import { AgentLog } from "../../entity/agent_log.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      mCategory,
      mSubCategory,
      mTemplate,
      User,
      WorkOrder,
      AgentLog,
      mGroup
    ])
  ],
  providers: [MasterDataService],
  controllers: [MasterDataController]
})
export class MasterDataModule {}
