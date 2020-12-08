import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { v4 as uuid } from "uuid";
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

  async findAgentAvailable(channelId: string) {
    const entityManager = getManager();
    let data = await entityManager.query(
      "SELECT agentUsername,slot,`limit` FROM work_order WHERE slot < `limit` and channelId = ? ORDER BY slot ASC, lastDist ASC LIMIT 1",
      [channelId]
    );

    if (data.length > 0) {
      let updateWorkOrder = new WorkOrder();
      updateWorkOrder.slot = data[0].slot + 1;
      updateWorkOrder.lastDist = new Date();
      this.workOrderRepository.update(
        { channelId: channelId, agentUsername: data[0].agentUsername },
        updateWorkOrder
      );
    }
    return data;
  }
}
