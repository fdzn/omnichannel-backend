import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { v4 as uuid } from "uuid";
import { Repository } from "typeorm";

//ENTITY
import { InteractionHeader } from "../../../entity/interaction_header.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>
  ) {}

  generate(channelId: string): string {
    const sessionId = `${channelId}-${uuid()}`;
    return sessionId;
  }

  async check(channelId: string, contactId: string): Promise<{ sessionId }> {
    const foundSession = await this.sessionRepository.findOne({
      select: ["sessionId"],
      where: { from: contactId, channelId: channelId },
    });
    return foundSession;
  }

  async create(
    sessionId: string,
    channelId: string,
    custId: number,
    { from, fromName, groupId, priority, account }
  ) {
    let insertHeader = new InteractionHeader();
    insertHeader.channelId = channelId;
    insertHeader.customerId = custId;
    insertHeader.from = from;
    insertHeader.fromName = fromName;
    insertHeader.groupId = groupId;
    insertHeader.priority = priority;
    insertHeader.sessionId = sessionId;
    insertHeader.account = account;
    insertHeader.startDate = new Date();
    return await this.sessionRepository.save(insertHeader);
  }
}
