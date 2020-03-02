import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";
@Injectable()
export class WhatsappService {
  private channelId: string;
  constructor(
    @InjectRepository(InteractionWhatsapp)
    private readonly whatsappRepository: Repository<InteractionWhatsapp>,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService
  ) {
    this.channelId = "whatsapp";
  }

  async saveInteraction(data: OutgoingWhatsapp) {
    let insertInteraction = new InteractionWhatsapp();
    insertInteraction.convId = data.convId;
    insertInteraction.from = data.from;
    insertInteraction.fromName = data.fromName;
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
