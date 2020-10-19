import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as FormData from "form-data";
import { LibsService } from "../../libs/services/lib.service";
//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";
@Injectable()
export class WhatsappService {
  constructor(
    private readonly libsService: LibsService,
    @InjectRepository(InteractionWhatsapp)
    private readonly whatsappRepository: Repository<InteractionWhatsapp>
  ) {}

  async saveInteraction(data: OutgoingWhatsapp, payload) {
    let insertInteraction = new InteractionWhatsapp();
    insertInteraction.convId = data.convId;
    insertInteraction.from = data.from;
    insertInteraction.fromName = payload.username;
    insertInteraction.media = data.media;
    insertInteraction.message = data.message;
    if (!data.media) {
      insertInteraction.messageType = "text";
    } else if (data.media.length < 10) {
      insertInteraction.messageType = "text";
    } else {
      insertInteraction.messageType = "media";
    }

    insertInteraction.actionType = ActionType.OUT;
    insertInteraction.sessionId = data.sessionId;
    insertInteraction.agentUsername = payload.username;
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
        const updateInteraction = new InteractionWhatsapp();
        updateInteraction.id = id;
        updateInteraction.sessionId = data.sessionId;
        updateInteraction.sendDate = new Date();
        updateInteraction.sendStatus = true;
        updateInteraction.systemMessage = JSON.stringify(resultDetail);
        updateInteraction.agentUsername = payload.username;
        const result = await this.whatsappRepository.save(updateInteraction);
        console.log("UPDATE STATUS", result);
      } else {
        const updateInteraction = new InteractionWhatsapp();
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

  async createOutgoing(data: OutgoingWhatsapp, payload) {
    try {
      this.saveInteraction(data, payload);
      return {
        isError: false,
        data: "outgoing success",
        statusCode: 201,
      };
    } catch (error) {
      return this.libsService.parseError(error);
    }
  }
}
