import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SessionInterface } from "../../schemas/session.schema";
import * as uuid from "uuid/v4";

//schema
@Injectable()
export class SessionService {
  constructor(
    @InjectModel("Session")
    private readonly sessionModel: Model<SessionInterface>
  ) {}

  generate(channelId: string): string {
    const sessionId = `${channelId}-${uuid()}`;
    return sessionId;
  }

  async find(channelId: string, contactId: string): Promise<SessionInterface> {
    const foundContactId = await this.sessionModel.findOne({
      channelId,
      contactId
    });
    return foundContactId;
  }

  async create(sessionId: string, channelId: string, custId, { from }) {
    const insertSession = new this.sessionModel({
      sessionId: sessionId,
      contactId: from,
      custId: custId,
      channelId: channelId,
      agentId: 0,
      groupId: 0,
      priority: 0,
      dateCreateSession: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await insertSession.save();
  }
}
