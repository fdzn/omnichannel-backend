import { Injectable } from "@nestjs/common";
import { getManager, getRepository } from "typeorm";

//ENTITY
import { InternalChat } from "../../entity/internal_chat.entity";
import { User } from "../../entity/user.entity";
//DTO
import { SendPost, GetChatPost } from "./dto/internalChat.dto";

@Injectable()
export class InternalChatService {
  async send(data: SendPost, payload) {
    try {
      let sentData = new InternalChat();
      sentData.fromUsername = payload.username;
      sentData.toUsername = data.to;
      sentData.room = `${payload.username}-${data.to}`;
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

      const repoInternalChat = getRepository(InternalChat);
      const sentStatus = await repoInternalChat.save(sentData);

      return {
        isError: false,
        data: sentStatus,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getChat(data: GetChatPost, payload) {
    try {
      const limit = 10;
      const repoInternalChat = getRepository(InternalChat);
      const listChat = await repoInternalChat.find({
        where: [
          { room: `${payload.username}-${data.to}` },
          { room: `${data.to}-${payload.username}` },
        ],
        order: {
          id: "DESC",
        },
        skip: data.page * limit,
        take: limit,
      });
      return {
        isError: false,
        data: listChat,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getChatAll(data: GetChatPost, payload) {
    try {
      const repoInternalChat = getRepository(InternalChat);
      const listChat = await repoInternalChat.find({
        where: [
          { room: `${payload.username}-${data.to}` },
          { room: `${data.to}-${payload.username}` },
        ],
        order: {
          id: "ASC",
        },
      });
      return {
        isError: false,
        data: listChat,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getUser(payload) {
    try {
      const repoUser = getRepository(User);
      let listUser = await repoUser.find({
        select: [
          "username",
          "name",
          "level",
          "avatar",
          "phone",
          "email",
          "unit",
          "group",
          "isOnline",
        ],
        where: {
          isDeleted: false,
          isActive: true,
        },
      });
      let output;
      output = listUser.filter((x) => x.username != payload.username);
      for (let index = 0; index < output.length; index++) {
        const x = output[index];
        const repoInternalChat = getRepository(InternalChat);
        const lastChat = await repoInternalChat.findOne({
          where: [
            { room: `${payload.username}-${x.username}` },
            { room: `${x.username}-${payload.username}` },
          ],
          order: {
            sendDate: "DESC",
          },
        });
        if (lastChat) {
          output[index].lastChat = lastChat;
        } else {
          output[index].lastChat = {};
        }
      }

      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async historyChat(payload) {
    try {
      const entityManager = getManager();
      const query = "";
      const repoInternalChat = getRepository(InternalChat);
      const listChat = await repoInternalChat.find({
        where: [{ from: payload.username }, { to: payload.username }],
        order: {
          id: "DESC",
        },
      });
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
