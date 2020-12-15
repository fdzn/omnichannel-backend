import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LibsService } from "../../libs/services/lib.service";
//ENTITY
import { InteractionWebchat } from "../../../entity/interaction_webchat.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWebchat } from "./dto/outgoing-webchat.dto";
@Injectable()
export class WebchatService {
  constructor(
    private readonly libsService: LibsService,
    @InjectRepository(InteractionWebchat)
    private readonly webchatRepository: Repository<InteractionWebchat>
  ) {}

  async saveInteraction(data: OutgoingWebchat, payload) {
    let insertInteraction = new InteractionWebchat();
    insertInteraction.convId = data.convId;
    insertInteraction.from = data.from;
    insertInteraction.fromName = payload.username;
    insertInteraction.media = data.media;
    insertInteraction.message = data.message;
    if (!data.media) {
      insertInteraction.messageType = "text";
    } else if (data.media.length < 10) {
      insertInteraction.messageType = "media";
    }

    insertInteraction.actionType = ActionType.OUT;
    insertInteraction.sessionId = data.sessionId;
    insertInteraction.agentUsername = payload.username;
    return this.webchatRepository.save(insertInteraction);
  }

  async octopushChat(data: OutgoingWebchat, resultSave, payload) {
    try {
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
      const result = await this.libsService.postHTTP(url, dataPost);
      const resultDetail = result.data;
      if (!resultDetail.error) {
        const updateInteraction = new InteractionWebchat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendDate = new Date();
        updateInteraction.sendStatus = true;
        updateInteraction.systemMessage = JSON.stringify(resultDetail.message);
        updateInteraction.agentUsername = payload.username;
        const result = await this.webchatRepository.save(updateInteraction);
      } else {
        const updateInteraction = new InteractionWebchat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendStatus = false;
        updateInteraction.systemMessage = JSON.stringify(resultDetail.message);
        updateInteraction.agentUsername = payload.username;
        await this.webchatRepository.save(updateInteraction);
      }
    } catch (error) {
      return this.libsService.parseError(error);
    }
  }
}
