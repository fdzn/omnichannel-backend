import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";

//DTO
import { VonagePost, IncomingVideoCall } from "./dto/incoming-videocall.dto";
import { ContactData } from "../../../dto/app.dto";

//ENTITY
import {
  InteractionVideoCall,
  ActionType,
} from "../../../entity/interaction_videocall.entity";
import { InteractionHeader } from "../../../entity/interaction_header.entity";

import { Customer } from "../../../entity/customer.entity";

//SERVICE
import { HeaderService } from "../../header/header.service";
@Injectable()
export class VideocallService {
  private channelId: string;
  constructor(private readonly headerService: HeaderService) {
    this.channelId = "videocall";
  }
  vonage(dataPost: VonagePost) {
    let dataApp = new IncomingVideoCall();
    dataApp.apiKey = dataPost.apiKey;
    dataApp.from = dataPost.email;
    dataApp.fromName = dataPost.name;
    dataApp.library = dataPost.library;
    dataApp.message = dataPost.message;
    dataApp.roomId = dataPost.roomId;
    dataApp.sessionVideo = dataPost.sessionId;
    dataApp.socketId = dataPost.socketId;
    dataApp.token = dataPost.token;

    //SET CONTACT
    dataApp.contact = new ContactData();
    dataApp.contact.email = dataPost.email;
    dataApp.contact.phone = dataPost.phone;

    //SET CUSTOMER
    dataApp.customer = new Customer();
    dataApp.customer.name = dataPost.name;

    return dataApp;
  }

  async incoming(data: IncomingVideoCall) {
    try {
      //FIND AGENT
      const foundAgent = await this.headerService.findAgentAvailable(
        this.channelId
      );

      if (foundAgent.length === 0) {
        return {
          isError: false,
          data: "No Agent Available",
          statusCode: 400,
        };
      }

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

      const repoVideo = getRepository(InteractionVideoCall);
      let insertInteraction = new InteractionVideoCall();
      insertInteraction.apiKey = data.apiKey;
      insertInteraction.from = data.from;
      insertInteraction.fromName = data.fromName;
      insertInteraction.library = data.library;
      insertInteraction.message = data.message;
      insertInteraction.roomId = data.roomId;
      insertInteraction.sendDate = new Date();
      insertInteraction.sessionId = generatedData.sessionId;
      insertInteraction.sessionVideo = data.sessionVideo;
      insertInteraction.socketId = data.socketId;
      insertInteraction.token = data.token;
      insertInteraction.agentUsername = foundAgent[0].agentUsername;
      insertInteraction.actionType = ActionType.IN;
      await repoVideo.save(insertInteraction);

      let insertSession = new InteractionHeader();
      insertSession.agentUsername = foundAgent[0].agentUsername;
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

  async test(data) {}
}
