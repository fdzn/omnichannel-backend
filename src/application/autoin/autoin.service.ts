import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";
import { workOrder } from "../../entity/work_order.entity";

//DTO
import { UpdateAuxPost, UpdateWorkOrderPost } from "./dto/autoin.dto";

@Injectable()
export class AutoInService {
  private channelId: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(workOrder)
    private readonly workOrderRepository: Repository<workOrder>
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
        return { isError: true, data: "No Data Update", statusCode: 204 };
      }
      return {
        isError: false,
        data: updateStatus,
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async updateWorkOrder(data: UpdateWorkOrderPost) {
    try {
      let updateData = new workOrder();
      updateData.slot = data.slot;
      updateData.lastDist = data.lastDist;

      const updateStatus = await this.workOrderRepository.update(
        { agentUsername: data.username, channelId: data.channelId },
        updateData
      );
      if (updateStatus.raw.affectedRows == 0) {
        return { isError: true, data: "No Data Update", statusCode: 204 };
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
