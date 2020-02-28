import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { workOrder } from "../../entity/work_order.entity";

//DTO
import { AuthLogin } from "./dto/auth-login.dto";
import { AuthLogout } from "./dto/auth-logout.dto";
@Injectable()
export class AuthService {
  private channelId: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(mGroupSkill)
    private readonly mGroupSkillRepository: Repository<mGroupSkill>,
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    @InjectRepository(workOrder)
    private readonly workOrderRepository: Repository<workOrder>
  ) {}

  async login(data: AuthLogin) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { username: data.username, isDeleted: 0 }
      });

      if (!foundUser) {
        return {
          isError: true,
          data: "username is not found",
          statusCode: 401
        };
      }

      if (data.password !== foundUser.password) {
        return {
          isError: true,
          data: "password incorrect",
          statusCode: 401
        };
      }
      const updateData = {
        isLogin: true
      };
      const updateStatus = await this.userRepository.update(
        { username: foundUser.username },
        updateData
      );

      const groupSkill = await this.mGroupSkillRepository.findOne({
        where: { agentUsername: foundUser.username }
      });

      return {
        isError: false,
        data: {
          user: foundUser,
          groupSkill: groupSkill
        },
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async logout(data: AuthLogout) {
    try {
      //UPDATE INTERACTION HEADER
      const updateHeader = {
        agentUsername: null
      };
      await this.sessionRepository.update(
        { agentUsername: data.username },
        updateHeader
      );

      //UPDATE WORK ORDER
      let updateWorkOrder = new workOrder();
      updateWorkOrder.slot = 0;
      await this.workOrderRepository.update(
        { agentUsername: data.username },
        updateWorkOrder
      );
      //UPDATE STATUS AGENT
      const updateUser = {
        isLogin: false,
        isAux: true
      };
      await this.userRepository.update({ username: data.username }, updateUser);
      return {
        isError: false,
        data: "logout Success",
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
