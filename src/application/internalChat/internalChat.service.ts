import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { InternalChat } from "../../entity/internal_chat.entity";

//DTO
import { SendPost, GetChatPost } from "./dto/internalChat.dto";

@Injectable()
export class InternalChatService {
  private channelId: string;
  constructor(
    @InjectRepository(InternalChat)
    private readonly internalChatRepository: Repository<InternalChat>
  ) {}

  async send(data: SendPost) {
    try {
      let sentData = new InternalChat();
      sentData.fromUsername = data.from;
      sentData.toUsername = data.to;
      sentData.room = `${data.from}-${data.to}`;
      sentData.message = data.message;
      sentData.sendDate = new Date();
      if (!data.media) {
        sentData.messageType = "text";
      } else if (data.media.length < 10) {
        sentData.messageType = "text";
      } else {
        sentData.messageType = "media";
        sentData.media = data.media;
      }

      const sentStatus = await this.internalChatRepository.save(sentData);

      return {
        isError: false,
        data: sentStatus,
        statusCode: 201
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getChat(data: GetChatPost) {
    try {
      const limit = 10;
      const listChat = await this.internalChatRepository.find({
        where: [
          { room: `${data.from}-${data.to}` },
          { room: `${data.to}-${data.from}` }
        ],
        order: {
          id: "DESC"
        },
        skip: data.page * limit,
        take: limit
      });
      return {
        isError: false,
        data: listChat,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
