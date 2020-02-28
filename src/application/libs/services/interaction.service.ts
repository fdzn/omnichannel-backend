import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getConnection, QueryBuilder } from "typeorm";
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { InteractionWhatsappHistory } from "../../../entity/interaction_whatsapp_history.entity";
import { ActionType } from "src/entity/templates/generalChat";

//schema
@Injectable()
export class InteractionLibService {
  constructor(
    @InjectRepository(InteractionWhatsapp)
    private readonly WhatsappRepository: Repository<InteractionWhatsapp>,
    @InjectRepository(InteractionWhatsappHistory)
    private readonly WhatsappHistoryRepository: Repository<InteractionWhatsapp>
  ) {}

  getRepository(channelId) {
    switch (channelId) {
      case "whatsapp":
        return {
          log: InteractionWhatsapp,
          logRepo: this.WhatsappRepository,
          history: InteractionWhatsappHistory,
          historyRepo: this.WhatsappHistoryRepository
        };

      default:
        return {
          log: null,
          logRepo: null,
          history: null,
          historyRepo: null
        };
    }
  }

  async moveToHistory(channelId: string, sessionId: string) {
    const repo = this.getRepository(channelId);
    const dataInteraction = await repo.logRepo.find({
      where: { sessionId: sessionId }
    });

    if (dataInteraction.length == 0) {
      return
    }

    await repo.historyRepo.insert(dataInteraction);
    return await repo.logRepo.delete({ sessionId: sessionId });
  }

  async getLastChat(channelId: string, sessionId: string) {
    const repo = this.getRepository(channelId);
    const result = await repo.logRepo.findOne({
      select: ["message"],
      where: { sessionId: sessionId },
      order: {
        id: "DESC"
      }
    });
    return result.message;
  }

  async countCase(channelId: string, sessionId: string) {
    const repo = this.getRepository(channelId);
    const caseIn = await repo.logRepo.count({
      sessionId: sessionId,
      actionType: ActionType.IN
    });

    const caseOut = await repo.logRepo.count({
      sessionId: sessionId,
      actionType: ActionType.OUT
    });
    return {
      caseIn: caseIn,
      caseOut: caseOut
    };
  }
}
