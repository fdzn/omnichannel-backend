import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
import { InteractionWhatsappHistory } from "../../../entity/interaction_whatsapp_history.entity";
import { InteractionVideoCallHistory } from "../../../entity/interaction_videocall_history.entity";

//DTO
import { ActionType } from "src/entity/templates/generalChat";
import { PostType } from "src/application/interaction/dto/interaction.dto";

//schema
@Injectable()
export class InteractionLibService {
  constructor(
    @InjectRepository(InteractionVideoCall)
    private readonly videoCallRepository: Repository<InteractionVideoCall>,
    @InjectRepository(InteractionVideoCallHistory)
    private readonly videoCallHistoryRepository: Repository<InteractionVideoCallHistory>,
    @InjectRepository(InteractionWhatsapp)
    private readonly WhatsappRepository: Repository<InteractionWhatsapp>,
    @InjectRepository(InteractionWhatsappHistory)
    private readonly WhatsappHistoryRepository: Repository<InteractionWhatsappHistory>
  ) {}

  getRepository(channelId: string) {
    switch (channelId) {
      case "whatsapp":
        return {
          log: InteractionWhatsapp,
          logRepo: this.WhatsappRepository,
          history: InteractionWhatsappHistory,
          historyRepo: this.WhatsappHistoryRepository,
        };
      case "videocall":
        return {
          log: InteractionVideoCall,
          logRepo: this.videoCallRepository,
          history: InteractionVideoCallHistory,
          historyRepo: this.videoCallHistoryRepository,
        };

      default:
        return {
          log: null,
          logRepo: null,
          history: null,
          historyRepo: null,
        };
    }
  }

  async moveToHistory(channelId: string, sessionId: string) {
    if (channelId === "voice") {
      return;
    }
    let repo;
    repo = this.getRepository(channelId);
    const dataInteraction = await repo.logRepo.find({
      where: { sessionId: sessionId },
    });

    if (dataInteraction.length == 0) {
      return;
    }

    await repo.historyRepo.insert(dataInteraction);
    return await repo.logRepo.delete({ sessionId: sessionId });
  }

  async getLastChat(channelId: string, sessionId: string) {
    if (channelId === "voice") {
      return null;
    }
    let repo;
    repo = this.getRepository(channelId);

    const result = await repo.logRepo.findOne({
      where: { sessionId: sessionId },
      order: {
        id: "DESC",
      },
    });
    return result;
  }

  async countCase(channelId: string, sessionId: string) {
    if (channelId === "voice") {
      return null;
    }
    let repo;
    repo = this.getRepository(channelId);
    const caseIn = await repo.logRepo.count({
      sessionId: sessionId,
      actionType: ActionType.IN,
    });

    const caseOut = await repo.logRepo.count({
      sessionId: sessionId,
      actionType: ActionType.OUT,
    });
    return {
      caseIn: caseIn,
      caseOut: caseOut,
    };
  }

  //FUNCTION INTERACTION
  async getInteractionWhatsapp(sessionId: string, type: PostType) {
    let messages;
    let from;
    let fromName;
    if (type == PostType.INTERACTION) {
      messages = await this.WhatsappRepository.find({
        select: [
          "id",
          "from",
          "fromName",
          "messageType",
          "message",
          "media",
          "sendDate",
          "actionType",
          "agentUsername",
          "convId",
        ],
        where: { sessionId: sessionId },
      });
    } else if (type == PostType.HISTORY) {
      messages = await this.WhatsappHistoryRepository.find({
        select: [
          "id",
          "from",
          "fromName",
          "messageType",
          "message",
          "media",
          "sendDate",
          "actionType",
          "agentUsername",
          "convId",
        ],
        where: { sessionId: sessionId },
      });
    }

    if (messages.length > 0) {
      const found = messages.find(
        (element) => element.actionType == ActionType.IN
      );
      if (found) {
        from = found.from;
        fromName = found.fromName;
      }
    }

    return {
      sessionId: sessionId,
      from: from,
      fromName: fromName,
      messages: messages,
    };
  }

  async getInteractionBySession(
    channelId: string,
    sessionId: string,
    type: PostType
  ) {
    let repo;
    repo = this.getRepository(channelId);
    if (type == PostType.INTERACTION) {
      return await repo.logRepo.find({
        where: { sessionId: sessionId },
      });
    } else if (type == PostType.HISTORY) {
      return await repo.historyRepo.find({
        where: { sessionId: sessionId },
      });
    }
  }

  async getInteractionByFrom(
    channelId: string,
    from: string,
    type: PostType,
    skip: number,
    take: number
  ) {
    let repo;
    repo = this.getRepository(channelId);
    let repoUse;
    if (type == PostType.INTERACTION) {
      repoUse = repo.logRepo;
    } else if (type == PostType.HISTORY) {
      repoUse = repo.historyRepo;
    }

    return await repoUse.find({
      where: { from: from },
      skip: skip,
      take: take,
    });
  }
}
