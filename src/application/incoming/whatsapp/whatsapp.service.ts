import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";

import { MinioNestService } from "../../../minio/minio.service";
import { InteractionHeader } from "../../../entity/interaction_header.entity";
import { Customer } from "src/entity/customer.entity";
import { InteractionChat } from "../../../entity/interaction_chat.entity";
import { ActionType } from "src/entity/templates/generalChat";

import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";
import { UploadURLPost } from "../../../minio/dto/minio.dto";
import { ContactData } from "../../../dto/app.dto";

import { HeaderService } from "src/application/header/header.service";
@Injectable()
export class WhatsappService {
  private channelId: string;
  constructor(
    private readonly headerService: HeaderService,
    private readonly minioService: MinioNestService
  ) {
    this.channelId = "whatsapp";
  }

  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  async capiwha(post) {
    const data = JSON.parse(post.data);
    let output = new IncomingWhatsapp();
    output.from = data.from;
    output.fromName = "No Name";
    output.account = data.to;
    output.dateSend = new Date();
    output.dateStream = new Date();
    if (this.validURL(data.text)) {
      let mediaPost = new UploadURLPost();
      mediaPost.directory = `whatsapp/${output.from}`;
      mediaPost.folder = "singlechannel";
      mediaPost.url = [data.text];
      const mediaResult = await this.minioService.uploadURL(mediaPost);
      if (mediaResult.isError) {
        return mediaResult;
      }

      output.media = JSON.stringify(mediaResult.data);
      output.messageType = "media";
    } else {
      output.message = data.text;
      output.messageType = "text";
    }

    //SET CONTACT
    output.contact = new ContactData();
    output.contact.phone = data.phone;
    //SET CUSTOMER
    output.customer = new Customer();
    output.customer.name = "";

    return {
      isError: false,
      data: output,
      statusCode: 200,
    };
  }

  async incoming(data: IncomingWhatsapp) {
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
        data: "incoming success",
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
