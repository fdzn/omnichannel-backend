import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MinioNestService } from "../../../minio/minio.service";
import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { InteractionChat } from "../../../entity/interaction_chat.entity";

import { ActionType } from "src/entity/templates/generalChat";

import { UploadURLPost } from "../../../minio/dto/minio.dto";
import { IncomingWebchat } from "./dto/incoming-webchat.dto";
import { Customer } from "src/entity/customer.entity";
import { Contact } from "src/entity/contact.entity";
import { LocationApp, RatingApp } from "src/dto/app.dto";

@Injectable()
export class WebchatService {
  private channelId: string;
  constructor(
    @InjectRepository(InteractionChat)
    private readonly webchatRepository: Repository<InteractionChat>,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService,
    private readonly minioService: MinioNestService
  ) {
    this.channelId = "webchat";
  }

  parseLocation(position) {
    let location = new LocationApp();
    location.latitude = position.lat;
    location.longitude = position.lng;
    return JSON.stringify(location);
  }

  async octopushChat(data) {
    let dataApp = new IncomingWebchat();
    dataApp.convId = data.message.token;
    dataApp.dateSend = new Date();
    dataApp.dateStream = new Date();

    if (data.action == "createSession") {
      let message = "";
      for (const property in data.message) {
        if (property != "token") {
          message += `${property}: ${data.message[property]}
            `;
        }
      }
      dataApp.message = message;
      dataApp.messageType = "text";

      dataApp.from = data.message.email;
      dataApp.fromName = data.message.username;
      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.username;
      dataApp.customer.gender = data.message.gender;
      let contact1 = new Contact();
      contact1.type = "email";
      contact1.value = data.message.email;

      let contact2 = new Contact();
      contact1.type = "hp";
      contact1.value = data.message.mobilePhone;

      dataApp.contact = [contact1, contact2];
    } else if (
      data.action == "clientReplyText" ||
      data.action == "clientEndSession"
    ) {
      dataApp.message = data.message.message;
      dataApp.messageType = "text";

      dataApp.from = data.message.user.email;
      dataApp.fromName = data.message.user.username;

      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;
      let contact1 = new Contact();
      contact1.type = "email";
      contact1.value = data.message.user.email;

      let contact2 = new Contact();
      contact1.type = "hp";
      contact1.value = data.message.user.mobilePhone;

      dataApp.contact = [contact1, contact2];
    } else if (data.action == "clientReplyMedia") {
      dataApp.from = data.message.user.email;
      dataApp.fromName = data.message.user.username;

      dataApp.message = data.message.message.fileName;
      dataApp.messageType = "media";

      let mediaPost = new UploadURLPost();
      mediaPost.directory = `webchat/${dataApp.from}`;
      mediaPost.folder = "singlechannel";
      mediaPost.url = [data.message.message.url];
      const mediaResult = await this.minioService.uploadURL(mediaPost);
      if (mediaResult.isError) {
        return mediaResult;
      }

      dataApp.media = JSON.stringify(mediaResult.data);

      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;
      let contact1 = new Contact();
      contact1.type = "email";
      contact1.value = data.message.user.email;

      let contact2 = new Contact();
      contact1.type = "hp";
      contact1.value = data.message.user.mobilePhone;

      dataApp.contact = [contact1, contact2];
    } else if (data.action == "clientReplyLocation") {
      const location = this.parseLocation(data.message.message.position);
      dataApp.message = location;
      dataApp.messageType = "location";
      dataApp.media = location;

      dataApp.from = data.message.user.email;
      dataApp.fromName = data.message.user.username;

      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;
      let contact1 = new Contact();
      contact1.type = "email";
      contact1.value = data.message.user.email;

      let contact2 = new Contact();
      contact1.type = "hp";
      contact1.value = data.message.user.mobilePhone;

      dataApp.contact = [contact1, contact2];
    } else {
      return {
        isError: true,
        data: "Undefined Type Webchat",
        statusCode: 500,
      };
    }
    return {
      isError: false,
      data: dataApp,
      statusCode: 200,
    };
  }

  async incoming(data: IncomingWebchat) {
    try {
      //CHECK SESSION
      let sessionId;
      let agentId;
      //SET PRIORITY
      const priority = 0;

      //SET GROUP ID
      const groupId = 1;

      const foundSession = await this.sessionService.check(
        this.channelId,
        data.from
      );
      if (foundSession) {
        sessionId = foundSession.sessionId;
        agentId = foundSession.agentUsername;
      } else if (!foundSession) {
        //GENERATE SESSION
        sessionId = this.sessionService.generate(this.channelId);
        //CUSTOMER
        let custId = await this.customerService.generate(
          data.contact,
          data.customer
        );

        //INSERT QUEUE
        let insertSession;
        insertSession = data;
        insertSession.priority = priority;
        insertSession.groupId = groupId;
        await this.sessionService.create(
          sessionId,
          this.channelId,
          custId,
          insertSession
        );
      }

      let insertInteraction = new InteractionChat();
      insertInteraction.channelId = "webchat";
      insertInteraction.actionType = ActionType.IN;
      insertInteraction.convId = data.convId;
      insertInteraction.from = data.from;
      insertInteraction.fromName = data.fromName;
      insertInteraction.media = data.media;
      insertInteraction.message = data.message;
      insertInteraction.messageType = data.messageType;
      insertInteraction.sendDate = data.dateSend;
      insertInteraction.sendStatus = true;
      insertInteraction.sessionId = sessionId;
      if (agentId) {
        insertInteraction.agentUsername = agentId;
      }
      await this.webchatRepository.save(insertInteraction);

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
