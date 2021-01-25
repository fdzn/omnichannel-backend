import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as FormData from "form-data";

//SERVICE
import { LibsService } from "../../libs/services/lib.service";
import { HeaderService } from "../../header/header.service";

//ENTITY
import { InteractionChat } from "../../../entity/interaction_chat.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";
@Injectable()
export class WhatsappService {
  constructor(
    private readonly libsService: LibsService,
    private readonly headerService: HeaderService,
    @InjectRepository(InteractionChat)
    private readonly whatsappRepository: Repository<InteractionChat>
  ) {}

  async saveInteraction(data: OutgoingWhatsapp, payload) {
    const now = new Date();
    const lastDate = data.lastDate ? new Date(data.lastDate) : now;
    const responseTime = (now.getTime() - lastDate.getTime()) / 1000;
    let insertInteraction = new InteractionChat();
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
    return this.whatsappRepository.save(insertInteraction);
  }

  async capiwha(data: OutgoingWhatsapp, resultSave, payload) {
    try {
      const { id } = resultSave;

      const url = process.env.CAPIWHA_OUTGOING_URL;

      const dataPost = new FormData();
      dataPost.append("apikey", process.env.CAPIWHA_KEY);
      dataPost.append("number", data.from);
      dataPost.append("text", data.media ? data.media : data.message);
      const config = { headers: dataPost.getHeaders() };
      const result = await this.libsService.postHTTP(url, dataPost, config);
      const resultDetail = result.data;
      if (resultDetail.success) {
        const updateInteraction = new InteractionChat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendDate = new Date();
        updateInteraction.sendStatus = true;
        updateInteraction.systemMessage = JSON.stringify(resultDetail);
        updateInteraction.agentUsername = payload.username;
        await this.whatsappRepository.save(updateInteraction);
      } else {
        const updateInteraction = new InteractionChat();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendStatus = false;
        updateInteraction.systemMessage = JSON.stringify(resultDetail);
        updateInteraction.agentUsername = payload.username;
        await this.whatsappRepository.save(updateInteraction);
      }
    } catch (error) {
      return this.libsService.parseError(error);
    }
  }
}
