import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";
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

  async createIncoming(data: IncomingWhatsapp) {
    try {
      let sessionId;
      data.fromName = data.fromName ? data.fromName : "-";

      //CHECK SESSION
      const foundSession = await this.sessionService.check(
        this.channelId,
        data.from
      );
      if (foundSession) {
        sessionId = foundSession.sessionId;
      } else if (!foundSession) {
        let custId;
        //GENERATE SESSION
        sessionId = this.sessionService.generate(this.channelId);
        const contactType = await this.customerService.checkContactType(
          this.channelId
        );
        //CHECK CONTACT
        const checkContact = await this.customerService.checkContact(
          contactType,
          data.from
        );
        if (checkContact) {
          custId = checkContact.customerId;
        } else if (!checkContact) {
          //CREATE NEW CUSTOMER
          const detailCust = await this.customerService.create(
            contactType,
            data
          );
          custId = detailCust.id;
        }

        //INSERT QUEUE
        let insertSession;
        insertSession = data;
        insertSession.priority = 0;
        insertSession.groupId = 1;
        const resultSessionCreate = await this.sessionService.create(
          sessionId,
          this.channelId,
          custId,
          insertSession
        );
      }

      let insertInteraction = new InteractionWhatsapp();
      insertInteraction.convId = data.convId;
      insertInteraction.from = data.from;
      insertInteraction.fromName = data.fromName;
      insertInteraction.media = data.media;
      insertInteraction.message = data.message;
      if (!data.media) {
        insertInteraction.messageType = "text";
      } else if(data.media.length < 10) {
        insertInteraction.messageType = "text";
      }else{
        insertInteraction.messageType = "media";
      }

      insertInteraction.actionType = ActionType.IN;
      insertInteraction.sessionId = sessionId;
      insertInteraction.sendDate = new Date();
      await this.whatsappRepository.save(insertInteraction);
      return {
        isError: false,
        data: "incoming success",
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
