import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";
import { InteractionHeader } from "../../entity/interaction_header.entity";

@Injectable()
export class AuthService {
  private channelId: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(mGroupSkill)
    private readonly mGroupSkillRepository: Repository<mGroupSkill>,
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>
  ) {}

  async login(data) {
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
          data: "password is not found",
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
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async logout(data) {
    try {
      //UPDATE INTERACTION HEADER
      const updateHeader = {
        agentUsername: null
      };
      await this.sessionRepository.update(
        { agentUsername: data.username },
        updateHeader
      );

      const updateUser = {
        isLogin: false
      };
      await this.userRepository.update(
        { username: data.username },
        updateUser
      );
      return {
        isError: false,
        data: "logout Success",
        statusCode: 201
      };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
