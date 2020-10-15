import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { WorkOrder } from "../../entity/work_order.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(mGroupSkill)
    private readonly mGroupSkillRepository: Repository<mGroupSkill>,
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const foundUser = await this.userRepository.findOne({
        select: ["username", "password"],
        where: {
          username: username,
          isDeleted: false,
          isLogin: false,
          isActive: true,
        },
      });

      if (!foundUser) {
        return {
          isError: true,
          data: "username is not found",
        };
      }

      if (password !== foundUser.password) {
        return {
          isError: true,
          data: "password incorrect",
        };
      }

      return {
        isError: false,
        data: "authentication success",
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message };
    }
  }

  async updateLoginData(username: string) {
    const updateData = {
      isLogin: true,
    };

    return await this.userRepository.update({ username: username }, updateData);
  }

  async getDetailUser(username: string) {
    const foundUser = await this.userRepository.findOne({
      select: [
        "username",
        "name",
        "level",
        "phone",
        "hostPBX",
        "loginPBX",
        "passwordPBX",
        "unitId",
        "groupId",
      ],
      where: {
        username: username,
      },
    });

    const groupSkill = await this.mGroupSkillRepository.findOne({
      select: ["channelId"],
      where: { agentUsername: foundUser.username },
    });
    let detailUser;
    detailUser = foundUser;
    detailUser.skill = groupSkill ? groupSkill : null;

    let output = { ...detailUser };
    return output;
  }

  async login(username: string) {
    try {
      // const resultUpdate = await this.updateLoginData(username);
      const detailUser = await this.getDetailUser(username);
      // console.log(detailUser)
      const accessToken = this.jwtService.sign(detailUser);
      return {
        isError: false,
        data: {
          detailUser: detailUser,
          accessToken: accessToken,
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async logout(payload) {
    try {
      //UPDATE INTERACTION HEADER
      const updateHeader = {
        agentUsername: null,
      };
      await this.sessionRepository.update(
        { agentUsername: payload.username },
        updateHeader
      );

      //UPDATE WORK ORDER
      let updateWorkOrder = new WorkOrder();
      updateWorkOrder.slot = 0;
      await this.workOrderRepository.update(
        { agentUsername: payload.username },
        updateWorkOrder
      );

      //UPDATE STATUS AGENT
      const updateUser = {
        isLogin: false,
        isAux: true,
      };
      await this.userRepository.update(
        { username: payload.username },
        updateUser
      );
      return {
        isError: false,
        data: "logout Success",
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
