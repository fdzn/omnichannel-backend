import { Injectable } from "@nestjs/common";

//DTO
import { AsteriskPost, IncomingVoice } from "./dto/incoming-voice.dto";
import { Customer } from "../../../entity/customer.entity";
import { ContactApp } from "../../../dto/app.dto";

//SERVICE
import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";

@Injectable()
export class VoiceService {
  private channelId: string;
  constructor(
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService
  ) {
    this.channelId = "voice";
  }

  asterisk(data: AsteriskPost) {
    const name = data.name ? data.name : data.phone;

    let dataApp = new IncomingVoice();
    dataApp.agentUsername = data.agentId;
    dataApp.from = data.phone;
    dataApp.fromName = name;
    let contact = new ContactApp();
    contact.type = "hp";
    contact.value = data.phone;
    dataApp.contact = [contact];

    //SET CUSTOMER
    dataApp.customer = new Customer();
    dataApp.customer.name = name;

    return dataApp;
  }

  async incoming(data: IncomingVoice) {
    try {
      //GENERATE SESSION
      let sessionId = this.sessionService.generate(this.channelId);

      //CUSTOMER
      let custId = await this.customerService.generate(
        data.contact,
        data.customer
      );

      //SET PRIORITY
      const priority = 0;

      //SET GROUP ID
      const groupId = 1;

      let insertSession;
      insertSession = data;
      insertSession.priority = priority;
      insertSession.groupId = groupId;
      insertSession.agentId = data.agentUsername;
      await this.sessionService.create(
        sessionId,
        this.channelId,
        custId,
        insertSession
      );

      data.customer = await this.customerService.getById(custId);
      return {
        isError: false,
        data: data,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
