import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
    insertInteraction.sendDate = new Date();
    return this.whatsappRepository.save(insertInteraction);
  }

  async capiwha(data: OutgoingWhatsapp, payload) {
    console.log("SEND", data);
    try {
      await this.saveInteraction(data, payload);
      const url = process.env.CAPIWHA_OUTGOING_URL;
      const dataPost = {
        apikey: process.env.CAPIWHA_KEY,
        number: data.from,
        text: data.media ? data.media : data.message,
      };
      return await this.libsService.postHTTP(url, dataPost);
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
