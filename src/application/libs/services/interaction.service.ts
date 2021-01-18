import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";
import { InteractionChatHistory } from "../../../entity/interaction_chat_history.entity";
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
import { InteractionVideoCallHistory } from "../../../entity/interaction_videocall_history.entity";
import { InteractionHeaderHistoryToday } from "../../../entity/interaction_header_history_today.entity";
import { InteractionHeaderHistory } from "../../../entity/interaction_header_history.entity";

import { LibsService } from "./lib.service";
//DTO
import { ActionType } from "src/entity/templates/generalChat";
import { PostType } from "src/application/interaction/dto/interaction.dto";

//schema
@Injectable()
export class InteractionLibService {
  constructor(
    private readonly libsService: LibsService,
    @InjectRepository(InteractionVideoCall)
    private readonly videoCallRepository: Repository<InteractionVideoCall>,
    @InjectRepository(InteractionVideoCallHistory)
    private readonly videoCallHistoryRepository: Repository<InteractionVideoCallHistory>,
    @InjectRepository(InteractionChat)
    private readonly chatRepository: Repository<InteractionChat>,
    @InjectRepository(InteractionChatHistory)
    private readonly chatHistoryRepository: Repository<InteractionChatHistory>,
    @InjectRepository(InteractionHeaderHistoryToday)
    private readonly headerTodayRepository: Repository<InteractionHeaderHistoryToday>
  ) {}

  getRepository(channelId: string) {
    if (channelId == "videocall") {
      return {
        log: InteractionVideoCall,
        logRepo: this.videoCallRepository,
        history: InteractionVideoCallHistory,
        historyRepo: this.videoCallHistoryRepository,
      };
    } else {
      return {
        log: InteractionChat,
        logRepo: this.chatRepository,
        history: InteractionChatHistory,
        historyRepo: this.chatHistoryRepository,
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

  async moveToTableToday(data: InteractionHeaderHistory) {
    return this.headerTodayRepository.save(data);
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
      return {
        caseIn: 0,
        caseOut: 0,
      };
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
  async endSessionWebchat(sessionId: string) {
    try {
      const getConvId = await this.chatRepository.findOne({
        select: ["convId"],
        where: {
          sessionId: sessionId,
        },
        order: {
          id: "DESC",
        },
      });

      if (getConvId) {
        const convId = getConvId.convId;
        const postData = {
          token: convId,
          fromName: "SYSTEM",
        };
        const url = `${process.env.WEBCHAT_OUTGOING_URL}/agent/endSession`;
        await this.libsService.postHTTP(url, postData);
      }
    } catch (e) {
      return this.libsService.parseError(e);
    }
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
