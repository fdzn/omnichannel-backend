import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../entity/user.entity";
import { mGroupSkill } from "../../entity/m_group_skill.entity";

@Injectable()
export class AuthService {
  private channelId: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(mGroupSkill)
    private readonly mGroupSkillRepository: Repository<mGroupSkill>
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
}
