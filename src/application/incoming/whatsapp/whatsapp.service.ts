import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MinioNestService } from "../../../minio/minio.service";
import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";
import { InteractionWhatsapp } from "../../../entity/interaction_whatsapp.entity";
import { ActionType } from "src/entity/templates/generalChat";

import { IncomingWhatsapp } from "./dto/incoming-whatsapp.dto";
import { UploadURLPost } from "../../../minio/dto/minio.dto";
@Injectable()
export class WhatsappService {
  private channelId: string;
  constructor(
    @InjectRepository(InteractionWhatsapp)
    private readonly whatsappRepository: Repository<InteractionWhatsapp>,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService,
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
    console.log("INCOMING WHATSAPP", post);
    const data = JSON.parse(post.data);
    let output = new IncomingWhatsapp();
    output.from = data.from;
    output.fromName = "No Name";
    output.account = data.to;
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
    return {
      isError: false,
      data: output,
      statusCode: 200,
    };
  }

  async incoming(data: IncomingWhatsapp) {
    try {
      let sessionId;
      let agentId = null;
      data.fromName = data.fromName ? data.fromName : "-";

      //CHECK SESSION
      const foundSession = await this.sessionService.check(
        this.channelId,
        data.from
      );
      if (foundSession) {
        sessionId = foundSession.sessionId;
        agentId = foundSession.agentUsername;
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
        //SET PRIORITY
        const priority = 0;

        //SET GROUP ID
        const groupId = 1;

        //INSERT QUEUE
        let insertSession;
        insertSession = data;
        insertSession.priority = priority;
        insertSession.groupId = groupId;
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
      insertInteraction.messageType = data.messageType;
      insertInteraction.actionType = ActionType.IN;
      insertInteraction.sessionId = sessionId;
      insertInteraction.sendDate = new Date();
      insertInteraction.sendStatus = true;
      insertInteraction.agentUsername = agentId;
      await this.whatsappRepository.save(insertInteraction);
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
