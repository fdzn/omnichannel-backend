import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";

//SERVICE
import { MinioNestService } from "../../../minio/minio.service";
import { HeaderService } from "../../header/header.service";

//ENTITY & DTO
import { InteractionChat } from "../../../entity/interaction_chat.entity";
import { InteractionHeader } from "../../../entity/interaction_header.entity";
import { ActionType } from "src/entity/templates/generalChat";
import { UploadURLPost } from "../../../minio/dto/minio.dto";
import { IncomingWebchat } from "./dto/incoming-webchat.dto";
import { Customer } from "src/entity/customer.entity";
import { Contact } from "src/entity/contact.entity";
import { LocationApp, RatingApp } from "src/dto/app.dto";
import { ContactData } from "../../../dto/app.dto";

@Injectable()
export class WebchatService {
  private channelId: string;
  constructor(
    private readonly headerService: HeaderService,
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

      //SET CUSTOMER
      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.username;
      dataApp.customer.gender = data.message.gender;

      //SET CONTACT
      dataApp.contact = new ContactData();
      dataApp.contact.phone = data.message.mobilePhone;
      dataApp.contact.email = data.message.email;
    } else if (
      data.action == "clientReplyText" ||
      data.action == "clientEndSession"
    ) {
      dataApp.message = data.message.message;
      dataApp.messageType = "text";

      dataApp.from = data.message.user.email;
      dataApp.fromName = data.message.user.username;

      //SET CUSTOMER
      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;

      //SET CONTACT
      dataApp.contact = new ContactData();
      dataApp.contact.phone = data.message.user.mobilePhone;
      dataApp.contact.email = data.message.user.email;
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

      //SET CUSTOMER
      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;

      //SET CONTACT
      dataApp.contact = new ContactData();
      dataApp.contact.phone = data.message.user.mobilePhone;
      dataApp.contact.email = data.message.user.email;
    } else if (data.action == "clientReplyLocation") {
      const location = this.parseLocation(data.message.message.position);
      dataApp.message = location;
      dataApp.messageType = "location";
      dataApp.media = location;

      dataApp.from = data.message.user.email;
      dataApp.fromName = data.message.user.username;

      //SET CUSTOMER
      dataApp.customer = new Customer();
      dataApp.customer.name = data.message.user.username;
      dataApp.customer.gender = data.message.user.gender;

      //SET CONTACT
      dataApp.contact = new ContactData();
      dataApp.contact.phone = data.message.user.mobilePhone;
      dataApp.contact.email = data.message.user.email;
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
      const generatedData = await this.headerService.generate(
        this.channelId,
        data.from,
        data.customer,
        data.contact
      );

      if (generatedData.newInteraction) {
        //SET PRIORITY
        const priority = 0;

        //SET GROUP ID
        const groupId = 1;

        let insertSession = new InteractionHeader();
        insertSession.channelId = this.channelId;
        insertSession.customerId = generatedData.customer.id;
        insertSession.from = data.from;
        insertSession.fromName = data.fromName;
        insertSession.groupId = groupId;
        insertSession.priority = priority;
        insertSession.sessionId = generatedData.sessionId;
        insertSession.startDate = new Date();
        await this.headerService.save(insertSession);
      }

      const repoChat = getRepository(InteractionChat);
      let insertInteraction = new InteractionChat();
      insertInteraction.channelId = this.channelId;
      insertInteraction.convId = data.convId;
      insertInteraction.from = data.from;
      insertInteraction.fromName = data.fromName;
      insertInteraction.media = data.media;
      insertInteraction.message = data.message;
      insertInteraction.messageType = data.messageType;
      insertInteraction.actionType = ActionType.IN;
      insertInteraction.sessionId = generatedData.sessionId;
      insertInteraction.sendDate = data.dateSend;
      insertInteraction.sendStatus = true;
      insertInteraction.agentUsername = generatedData.agentUsername;
      await repoChat.save(insertInteraction);

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
