import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";
import { WorkOrder } from "../../entity/work_order.entity";

//DTO
import { UpdateAuxPost, UpdateWorkOrderPost } from "./dto/autoin.dto";

@Injectable()
export class AutoInService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>
  ) {}

  async updateAuxStatus(data: UpdateAuxPost) {
    try {
      let updateData = new User();
      updateData.isAux = data.auxStatus;

      const updateStatus = await this.userRepository.update(
        { username: data.username },
        updateData
      );
      if (updateStatus.raw.affectedRows == 0) {
        return { isError: true, data: "No Data Update", statusCode: 404 };
      }
      return {
        isError: false,
        data: updateStatus,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async updateWorkOrder(data: UpdateWorkOrderPost) {
    try {
      let updateData = new WorkOrder();
      updateData.slot = data.slot;
      updateData.lastDist = data.lastDist;

      const updateStatus = await this.workOrderRepository.update(
        { agentUsername: data.username, channelId: data.channelId },
        updateData
      );
      if (updateStatus.raw.affectedRows == 0) {
        return { isError: true, data: "No Data Update", statusCode: 404 };
      }
      return {
        isError: false,
        data: updateStatus,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
