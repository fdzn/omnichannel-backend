import { Injectable, HttpService, RequestMethod } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as FormData from "form-data";
import * as rp from "request-promise";
//ENTITY
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";
@Injectable()
export class WhatsappService {
  constructor(
    @InjectRepository(InteractionWhatsapp)
    private readonly whatsappRepository: Repository<InteractionWhatsapp>,
    private readonly httpService: HttpService
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
      const options = {
        method: "POST",
        url: "https://panel.capiwha.apiwha.com/send_message.php",
        headers: {
          "Content-Type": "application/json"
        },
        formData: {
          apikey: "BQ0FXHO336K3UOOV8CER",
          number: data.from,
          text: data.media ? data.media : data.message
        }
      };
      const response = await rp(options);
      const json = JSON.parse(response);
      if (json.success) {
        await this.saveInteraction(data, payload);
        return {
          isError: false,
          data: "outgoing success",
          statusCode: 201
        };
      } else {
        return {
          isError: true,
          data: json.description
            ? json.description
            : "Unknown error from capiwha",
          statusCode: 500
        };
      }
    } catch (error) {
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async createOutgoing(data: OutgoingWhatsapp,payload) {
    try {
      this.saveInteraction(data,payload);
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
