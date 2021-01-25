import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//SERVICE
import { LibsService } from "../../libs/services/lib.service";
import { HeaderService } from "../../header/header.service";
//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWebchat } from "./dto/outgoing-webchat.dto";
@Injectable()
export class WebchatService {
  constructor(
    private readonly libsService: LibsService,
    private readonly headerService: HeaderService,
    @InjectRepository(InteractionChat)
    private readonly webchatRepository: Repository<InteractionChat>
  ) {}

  async saveInteraction(data: OutgoingWebchat, payload) {
    const now = new Date();
    const lastDate = data.lastDate ? new Date(data.lastDate) : now;
    const responseTime = (now.getTime() - lastDate.getTime()) / 1000;
    let insertInteraction = new InteractionChat();
    insertInteraction.channelId = "webchat";
    insertInteraction.convId = data.convId;
    insertInteraction.from = data.from;
    insertInteraction.fromName = payload.username;
    insertInteraction.media = data.media;
    insertInteraction.message = data.message;

    if (!data.media) {
      insertInteraction.messageType = "text";
    } else {
      if (data.media == "") {
        insertInteraction.messageType = "text";
      } else {
        insertInteraction.messageType = "media";
      }
    }

    insertInteraction.actionType = ActionType.OUT;
    insertInteraction.sessionId = data.sessionId;
    insertInteraction.ResponseTime = responseTime;
    insertInteraction.agentUsername = payload.username;
    this.headerService.updateFrDate(data.sessionId);
    return this.webchatRepository.save(insertInteraction);
  }

  async octopushChat(data: OutgoingWebchat, resultSave, payload) {
    const { id } = resultSave;

    const urlBase = process.env.WEBCHAT_OUTGOING_URL;
    let url = urlBase;

    const dataPost = {
      token: data.convId,
      message: data.media ? data.media : data.message,
      fromName: payload.username,
    };
    if (!data.media) {
      url = `${urlBase}/agent/reply/text`;
    } else {
      url = `${urlBase}/agent/reply/media`;
    }
    const result = await this.libsService.postOutgoing(url, dataPost);
    const resultDetail = result.data;

    try {
      if (resultDetail == "Abandon" || resultDetail.error) {
        const updateInteraction = new InteractionChat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendStatus = false;
        updateInteraction.systemMessage = JSON.stringify(resultDetail.message);
        updateInteraction.agentUsername = payload.username;
        await this.webchatRepository.save(updateInteraction);
      } else {
        const updateInteraction = new InteractionChat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendDate = new Date();
        updateInteraction.sendStatus = true;
        updateInteraction.systemMessage = JSON.stringify(resultDetail.message);
        updateInteraction.agentUsername = payload.username;
        await this.webchatRepository.save(updateInteraction);
      }
    } catch (error) {
      return this.libsService.parseError(error);
    }
  }
}
