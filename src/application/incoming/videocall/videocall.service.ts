import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { VonagePost, IncomingVideoCall } from "./dto/incoming-videocall.dto";
import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
import { Customer } from "../../../entity/customer.entity";

import { ContactApp } from "../../../dto/app.dto";

@Injectable()
export class VideocallService {
  private channelId: string;
  constructor(
    @InjectRepository(InteractionVideoCall)
    private readonly videoCallRepository: Repository<InteractionVideoCall>,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService
  ) {
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
    let contact1 = new ContactApp();
    contact1.type = "email";
    contact1.value = dataPost.email;

    let contact2 = new ContactApp();
    contact2.type = "hp";
    contact2.value = dataPost.phone;
    dataApp.contact = [contact1, contact2];

    //SET CUSTOMER
    dataApp.customer = new Customer();
    dataApp.customer.name = dataPost.name;

    return dataApp;
  }

  async incoming(data: IncomingVideoCall) {
    try {
      //FIND AGENT
      const foundAgent = await this.sessionService.findAgentAvailable(
        this.channelId
      );

      if (foundAgent.length === 0) {
        return {
          isError: false,
          data: "No Agent Available",
          statusCode: 400,
        };
      }

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
      
      let insertInteraction = new InteractionVideoCall();
      insertInteraction.apiKey = data.apiKey;
      insertInteraction.from = data.from;
      insertInteraction.fromName = data.fromName;
      insertInteraction.library = data.library;
      insertInteraction.message = data.message;
      insertInteraction.roomId = data.roomId;
      insertInteraction.sendDate = new Date();
      insertInteraction.sessionId = sessionId;
      insertInteraction.sessionVideo = data.sessionVideo;
      insertInteraction.socketId = data.socketId;
      insertInteraction.token = data.token;
      await this.videoCallRepository.save(insertInteraction);
      
      let insertSession;
      insertSession = data;
      insertSession.priority = priority;
      insertSession.groupId = groupId;
      insertSession.agentId = foundAgent[0].agentUsername;
      await this.sessionService.create(
        sessionId,
        this.channelId,
        custId,
        insertSession
      );

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
