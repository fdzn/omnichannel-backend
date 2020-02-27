import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";

@Injectable()
export class AutoInService {
  private channelId: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async updateAuxStatus(data) {
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
}
