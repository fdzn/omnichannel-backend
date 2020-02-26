import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getConnection } from "typeorm";

import { InteractionHeader } from "../../entity/interaction_header.entity";

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>
  ) {}

  async pickupBySession(data) {
    try {
      const foundSession = await this.sessionRepository.findOne({
        where: { sessionId: data.sessionId }
      });
      if (!foundSession) {
        return { isError: true, data: "sessionId not found", statusCode: 404 };
      }

      let updateData = new InteractionHeader();
      updateData.agentUsername = data.agentId;
      updateData.pickupDate = new Date();
      const updateStatus = await this.sessionRepository.update(
        { sessionId: data.sessionId },
        updateData
      );
      return { isError: false, data: updateStatus, statusCode: 200 };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async pickupManual(data) {
    try {
      const foundSession = await this.sessionRepository.findOne({
        where: {
          agentUsername: null,
          groupId: data.groupId,
          channelId: data.channelId
        },
        order: {
          priority: "DESC",
          id: "ASC"
        }
      });

      if (!foundSession) {
        return { isError: true, data: "Queue Empty", statusCode: 404 };
      }

      let updateData = new InteractionHeader();
      updateData.agentUsername = data.agentId;
      updateData.pickupDate = new Date();
      
      const updateStatus = await this.sessionRepository.update(
        { id: foundSession.id },
        updateData
      );

      return { isError: false, data: foundSession, statusCode: 200 };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
