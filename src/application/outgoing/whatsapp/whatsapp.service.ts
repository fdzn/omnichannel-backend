import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";
@Injectable()
export class WhatsappService {
  constructor(
    @InjectRepository(InteractionWhatsapp)
    private readonly whatsappRepository: Repository<InteractionWhatsapp>
  ) {}

  async saveInteraction(data: OutgoingWhatsapp) {
    let insertInteraction = new InteractionWhatsapp();
    insertInteraction.convId = data.convId;
    insertInteraction.from = data.from;
    insertInteraction.fromName = data.username;
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
    insertInteraction.agentUsername = data.username;
    insertInteraction.sendDate = new Date();
    return this.whatsappRepository.save(insertInteraction);
  }

  async createOutgoing(data: OutgoingWhatsapp) {
    try {
      this.saveInteraction(data)
      //HIT API SEND
      //END HIT API
      return {
        isError: false,
        data: "outgoing success",
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
