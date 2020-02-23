import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { interactionWhatsapp } from "../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

@Injectable()
export class WhatsappService {
  private channelId: string;
  constructor(
    @InjectRepository(interactionWhatsapp)
    private readonly whatsappRepository: Repository<interactionWhatsapp>,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService
  ) {
    this.channelId = "whatsapp";
  }

  async test() {
    // const detailSession = await this.sessionService.check(
    //   this.channelId,
    //   "081286128030"
    // );
    // if (detailSession) {
    //   return true;
    // } else {
    //   return false;
    // }
    return true;
  }

  async createIncoming(data) {
    let sessionId;
    data.fromName = data.fromName ? data.fromName : "noName";

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
        const detailCust = await this.customerService.create(contactType, data);
        custId = detailCust.id;
      }

      //INSERT QUEUE
      data.priority = 0
      data.groupId = 1
      const resultSessionCreate = await this.sessionService.create(
        sessionId,
        this.channelId,
        custId,
        data
      );
    }

    let insertInteraction = new interactionWhatsapp();
    insertInteraction = data;
    insertInteraction.actionType = ActionType.IN;
    insertInteraction.sessionId = sessionId;
    insertInteraction.sendDate = new Date();
    return this.whatsappRepository.save(insertInteraction);
  }
}
