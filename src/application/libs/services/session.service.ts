import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { nanoid } from "nanoid";
import { Repository, getManager } from "typeorm";

//ENTITY
import { InteractionHeader } from "../../../entity/interaction_header.entity";
import { WorkOrder } from "../../../entity/work_order.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>
  ) {}

  generate(channelId: string): string {
    const sessionId = `${channelId}-${nanoid()}`;
    return sessionId;
  }

  async check(
    channelId: string,
    contactId: string
  ): Promise<{ sessionId; agentUsername }> {
    const foundSession = await this.sessionRepository.findOne({
      select: ["sessionId", "agentUsername"],
      where: { from: contactId, channelId: channelId },
    });
    return foundSession;
  }

  async create(
    sessionId: string,
    channelId: string,
    custId: number,
    { from, fromName, groupId, priority, account, agentId }
  ) {
    let insertHeader = new InteractionHeader();
    insertHeader.channelId = channelId;
    insertHeader.customerId = custId;
    insertHeader.from = from;
    insertHeader.fromName = fromName;
    insertHeader.agentUsername = agentId ? agentId : undefined;
    insertHeader.groupId = groupId;
    insertHeader.priority = priority;
    insertHeader.sessionId = sessionId;
    insertHeader.account = account;
    insertHeader.startDate = new Date();
    return await this.sessionRepository.save(insertHeader);
  }
}
