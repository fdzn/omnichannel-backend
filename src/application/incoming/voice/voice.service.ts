import { Injectable } from "@nestjs/common";

//DTO
import { AsteriskPost, IncomingVoice } from "./dto/incoming-voice.dto";
import { ContactData } from "../../../dto/app.dto";

//ENTITY
import { InteractionHeader } from "../../../entity/interaction_header.entity";
import { Customer } from "src/entity/customer.entity";
//SERVICE
import { HeaderService } from "../../header/header.service";

@Injectable()
export class VoiceService {
  private channelId: string;
  constructor(private readonly headerService: HeaderService) {
    this.channelId = "voice";
  }

  asterisk(data: AsteriskPost) {
    const name = data.name ? data.name : data.phone;

    let dataApp = new IncomingVoice();
    dataApp.agentUsername = data.agentId;
    dataApp.from = data.phone;
    dataApp.fromName = name;

    //SET CONTACT
    dataApp.contact = new ContactData();
    dataApp.contact.phone = data.phone;
    //SET CUSTOMER
    dataApp.customer = new Customer();
    dataApp.customer.name = name;

    return dataApp;
  }

  async incoming(data: IncomingVoice) {
    try {
      const generatedData = await this.headerService.generate(
        this.channelId,
        data.from,
        data.customer,
        data.contact
      );

      //SET PRIORITY
      const priority = 0;

      //SET GROUP ID
      const groupId = 1;

      let insertSession = new InteractionHeader();
      insertSession.agentUsername = data.agentUsername;
      insertSession.channelId = this.channelId;
      insertSession.customerId = generatedData.customer.id;
      insertSession.frDate = new Date();
      insertSession.from = data.from;
      insertSession.fromName = data.fromName;
      insertSession.groupId = groupId;
      insertSession.pickupDate = new Date();
      insertSession.priority = priority;
      insertSession.sessionId = generatedData.sessionId;
      insertSession.startDate = new Date();
      await this.headerService.save(insertSession);

      data.customer = generatedData.customer;
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
