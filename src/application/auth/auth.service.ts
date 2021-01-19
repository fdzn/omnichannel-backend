import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { User } from "../../entity/user.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { WorkOrder } from "../../entity/work_order.entity";
import { AgentLog } from "../../entity/agent_log.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AgentLog)
    private readonly agentLogRepository: Repository<AgentLog>,
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
          isActive: true
        }
      });

      if (!foundUser) {
        return {
          isError: true,
          data: "username is not found"
        };
      }

      if (password !== foundUser.password) {
        return {
          isError: true,
          data: "password incorrect"
        };
      }

      return {
        isError: false,
        data: "authentication success"
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message };
    }
  }

  async agentLogLogin(username) {
    try {
      // Insert Agent Log
      let newAgentLog = new AgentLog();

      newAgentLog.username = username;
      newAgentLog.reason = "login";
      newAgentLog.timeStart = new Date();
      newAgentLog.updater = username;

      return await this.agentLogRepository.save(newAgentLog);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async agentLogLogout(username) {
    try {
      // Update Agent Log
      const foundUser = await this.agentLogRepository.findOne({
        select: ["id"],
        where: {
          username,
          timeEnd: IsNull()
        }
      });
      console.log("foundUser", foundUser);
      if (foundUser) {
        let updateAgentLog = new AgentLog();

        updateAgentLog.logoutReason = "logout";
        updateAgentLog.timeEnd = new Date();
        updateAgentLog.updater = username;

        return await this.agentLogRepository.update(
          {
            id: foundUser.id
          },
          updateAgentLog
        );
      }

      return;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateLoginData(username: string) {
    const updateData = {
      isLogin: true
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
        "isAux"
      ],
      where: {
        username: username
      }
    });

    let detailUser;
    detailUser = foundUser;

    let output = { ...detailUser };
    return output;
  }

  async login(username: string) {
    try {
      const resultUpdate = await this.updateLoginData(username);
      const detailUser = await this.getDetailUser(username);
      const accessToken = this.jwtService.sign(detailUser);
      const agentLog = await this.agentLogLogin(username);

      return {
        isError: false,
        data: accessToken,
        statusCode: 200
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
        agentUsername: null
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
        isAux: true
      };
      await this.userRepository.update(
        { username: payload.username },
        updateUser
      );

      await this.agentLogLogout(payload.username);

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
