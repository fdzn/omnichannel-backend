import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getConnection } from "typeorm";

import { InteractionHeader } from "../../entity/interaction_header.entity";
import { Cwc } from "../../entity/cwc.entity";

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    @InjectRepository(Cwc)
    private readonly cwcRepository: Repository<Cwc>
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

  async endSession(data) {
    try {
      let updateData = new InteractionHeader();
      updateData.endDate = new Date();
      updateData.endStatus = true;
      const updateStatus = await this.sessionRepository.update(
        { sessionId: data.sessionId },
        updateData
      );

      return { isError: false, data: updateStatus, statusCode: 200 };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async submitCWC(data) {
    try {
      const dateNow = new Date();

      //UPDATE SUBMIT DATA
      let updateHeader = new InteractionHeader();
      updateHeader.submitCwcDate = dateNow;
      const updateHeaderStatus = await this.sessionRepository.update(
        { sessionId: data.sessionId, endStatus: true },
        updateHeader
      );

      if (updateHeaderStatus.raw.affected == 0) {
        return { isError: false, data: "SessionId not found", statusCode: 404 };
      }

      //GET SESSION ID
      const foundSession = await this.sessionRepository.findOne({
        where: { sessionId: data.sessionId }
      });

      //INSERT KE HISTORY
      let insertDataHistory = new InteractionHeader();
      insertDataHistory = foundSession;

      //DELETE HEADER
      const DeleteStatus = this.sessionRepository.delete({
        sessionId: data.sessionId, endStatus: true
      });
      
      //INSERT CWC
      let insertCwc = new Cwc();
      insertCwc.agentUsername = data.agentId
      insertCwc.categoryId = data.categoryId
      insertCwc.channelId = data.channelId
      insertCwc.customerId = data.customerId
      insertCwc.feedback = data.feedback
      insertCwc.remark = data.remark
      insertCwc.name = data.name
      insertCwc.sentiment = data.sentiment
      insertCwc.sessionId = data.sessionId
      insertCwc.subcategoryId = data.subcategoryId
      insertCwc.updaterUsername = data.agentId
      const resultInsert = await this.cwcRepository.save(insertCwc);

      return { isError: false, data: resultInsert, statusCode: 200 };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
