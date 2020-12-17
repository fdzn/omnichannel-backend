import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager } from "typeorm";

//ENTITY
import { InteractionLibService } from "../libs/services/interaction.service";
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { Cwc } from "../../entity/cwc.entity";
import { WorkOrder } from "../../entity/work_order.entity";

//DTO
import {
  pickupManualPost,
  pickupAutoPost,
  endPost,
  GetInteractionPost,
  GetInteractionByCustomerPost,
  GetInteractionSpecific,
  loadWorkOrderPost,
  JourneyPost,
  IsAbandonPut,
} from "./dto/interaction.dto";
import { CwcPost } from "./dto/cwc.dto";

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    @InjectRepository(InteractionHeaderHistory)
    private readonly sessionHistoryRepository: Repository<InteractionHeaderHistory>,
    @InjectRepository(Cwc)
    private readonly cwcRepository: Repository<Cwc>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    private readonly interactionLibService: InteractionLibService
  ) {}

  async updateAbandon(data: IsAbandonPut) {
    try {
      let updateData = new InteractionHeader();
      updateData.isAbandon = data.isAbandon;

      const resultUpdate = await this.sessionRepository.update(
        {
          sessionId: data.sessionId,
        },
        updateData
      );

      return { isError: false, data: resultUpdate, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
  async pickupManual(data: pickupManualPost, payload) {
    try {
      const foundSession = await this.sessionRepository.findOne({
        where: {
          agentUsername: null,
          groupId: payload.groupId,
          channelId: data.channelId,
        },
        order: {
          priority: "DESC",
          id: "ASC",
        },
      });

      if (!foundSession) {
        return { isError: true, data: "Queue Empty", statusCode: 404 };
      }

      let updateData = new InteractionHeader();
      updateData = foundSession;
      updateData.agentUsername = payload.username;
      updateData.pickupDate = new Date();

      const updateStatus = await this.sessionRepository.save(updateData);

      return { isError: false, data: foundSession, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async pickupBySession(data: pickupAutoPost) {
    try {
      const foundSession = await this.sessionRepository.findOne({
        where: { sessionId: data.sessionId },
      });
      if (!foundSession) {
        return { isError: true, data: "sessionId not found", statusCode: 404 };
      }

      let updateData = new InteractionHeader();
      updateData = foundSession;
      updateData.agentUsername = data.username;
      updateData.pickupDate = new Date();

      const updateStatus = await this.sessionRepository.save(updateData);

      return { isError: false, data: updateStatus, statusCode: 200 };
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async loadJourney(data: JourneyPost) {
    try {
      const limit = 10;
      const entityManager = getManager();
      const journey = await entityManager.query(
        `SELECT a.sessionId,a.startDate,a.agentUsername,c.name as category,d.name as subCategory,a.channelId,b.sentiment 
        FROM interaction_header_history a 
        LEFT JOIN cwc b on a.sessionId=b.sessionId 
        LEFT JOIN m_category c on b.categoryId = c.id
        LEFT JOIN m_sub_category d on b.subcategoryId = d.id
        WHERE a.customerId=? LIMIT ?,?`,
        [data.customerId, data.page * limit, limit]
      );
      return { isError: false, data: journey, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async loadWorkOrder(payload) {
    try {
      const foundSession = await this.sessionRepository.find({
        where: {
          agentUsername: payload.username,
        },
      });

      if (foundSession.length == 0) {
        return { isError: false, data: [], statusCode: 200 };
      }

      let result;
      result = foundSession;
      for (let index = 0; index < result.length; index++) {
        result[index].lastChat = await this.interactionLibService.getLastChat(
          result[index].channelId,
          result[index].sessionId
        );
      }
      return { isError: false, data: result, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async loadWorkOrderByChannel(data: loadWorkOrderPost, payload) {
    try {
      const foundSession = await this.sessionRepository.find({
        where: {
          agentUsername: payload.username,
          channelId: data.channelId,
        },
      });

      if (foundSession.length == 0) {
        return { isError: false, data: [], statusCode: 200 };
      }

      let result;
      result = foundSession;
      for (let index = 0; index < result.length; index++) {
        result[index].lastChat = await this.interactionLibService.getLastChat(
          result[index].channelId,
          result[index].sessionId
        );
      }
      return { isError: false, data: result, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getInteractionWhatsapp(data: GetInteractionSpecific) {
    try {
      const output = await this.interactionLibService.getInteractionWhatsapp(
        data.sessionId,
        data.type
      );

      return { isError: false, data: output, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getInteraction(data: GetInteractionPost) {
    try {
      const output = await this.interactionLibService.getInteractionBySession(
        data.channelId,
        data.sessionId,
        data.type
      );

      return { isError: false, data: output, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getInteractionByCustomer(data: GetInteractionByCustomerPost) {
    try {
      const limit = 10;
      const output = await this.interactionLibService.getInteractionByFrom(
        data.channelId,
        data.from,
        data.type,
        data.page * limit,
        limit
      );

      return { isError: false, data: output, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async updateWorkOrder(channelId, username) {
    const findWorkOrder = await this.workOrderRepository.findOne({
      select: ["slot"],
      where: { channelId: channelId, agentUsername: username },
    });
    if (findWorkOrder.slot > 0) {
      let updateWorkOrder = new WorkOrder();
      updateWorkOrder.slot = findWorkOrder.slot - 1;
      this.workOrderRepository.update(
        { channelId: channelId, agentUsername: username },
        updateWorkOrder
      );
    }
  }
  async submitCWC(data: CwcPost, payload) {
    try {
      const dateNow = new Date();

      //COUNT CASE
      const countCase = await this.interactionLibService.countCase(
        data.channelId,
        data.sessionId
      );

      //UPDATE SUBMIT DATA
      let updateHeader = new InteractionHeader();
      updateHeader.submitCwcDate = dateNow;
      updateHeader.caseIn = countCase.caseIn;
      updateHeader.caseOut = countCase.caseOut;
      const updateHeaderStatus = await this.sessionRepository.update(
        { sessionId: data.sessionId },
        updateHeader
      );

      if (updateHeaderStatus.raw.affectedRows == 0) {
        return { isError: false, data: "SessionId not found", statusCode: 404 };
      }

      //HIT API END SESSION
      if (data.channelId == "webchat") {
        this.interactionLibService.endSessionWebchat(data.sessionId);
      }

      //GET SESSION ID
      const foundSession = await this.sessionRepository.findOne({
        where: { sessionId: data.sessionId },
      });

      // //MOVE HEADER TO HISTORY
      let insertDataHistory = new InteractionHeader();
      insertDataHistory = foundSession;
      await this.sessionHistoryRepository.save(insertDataHistory);
      await this.sessionRepository.remove(insertDataHistory);

      //MOVE INTERACTION TO HISTORY
      const move = await this.interactionLibService.moveToHistory(
        foundSession.channelId,
        data.sessionId
      );

      this.updateWorkOrder(data.channelId, payload.username);

      //INSERT CWC
      let insertCwc = new Cwc();
      insertCwc.agentUsername = payload.username;
      insertCwc.categoryId = data.categoryId;
      insertCwc.feedback = data.feedback;
      insertCwc.remark = data.remark;
      insertCwc.sentiment = data.sentiment;
      insertCwc.sessionId = data.sessionId;
      insertCwc.subcategoryId = data.subcategoryId;
      insertCwc.updaterUsername = payload.username;
      const resultInsert = await this.cwcRepository.save(insertCwc);

      return { isError: false, data: move, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
