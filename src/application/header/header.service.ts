import { Injectable } from "@nestjs/common";
import { Between, getManager, getRepository } from "typeorm";
import { nanoid } from "nanoid";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../../entity/interaction_header_history_today.entity";
import { Customer } from "../../entity/customer.entity";
import { WorkOrder } from "../../entity/work_order.entity";

//SERVICE
import { CustomerService } from "../customer/customer.service";

//CONFIG
import * as channelConfig from "../config/channel.json";
import { ContactData } from "src/dto/app.dto";
@Injectable()
export class HeaderService {
  constructor(private readonly customerService: CustomerService) {}

  async generate(
    channelId: string,
    from_id: string,
    customer: Customer,
    contact: ContactData
  ): Promise<{
    sessionId: string;
    agentUsername: string,
    customer: Customer;
    newInteraction: boolean;
  }> {
    const getConfig = channelConfig.find((x) => x.channelId === channelId);
    if (getConfig) {
      let output = {
        sessionId: undefined,
        customer: undefined,
        agentUsername:undefined,
        newInteraction: true,
      };
      if (!getConfig.multiSession) {
        const repoHeader = getRepository(InteractionHeader);
        const getSession = await repoHeader.findOne({
          select: ["sessionId", "customerId", "agentUsername"],
          where: { from: from_id, channelId: channelId },
        });

        if (getSession) {
          output.sessionId = getSession.sessionId;
          output.customer = new Customer();
          output.customer.id = getSession.customerId;
          output.agentUsername = getSession.agentUsername;
          output.newInteraction = false;
          return output;
        } else {
          output.sessionId = `${channelId}-${nanoid()}`;
          output.customer = await this.customerService.generateCustomer(
            customer,
            contact
          );
          output.newInteraction = true;
        }
      } else {
        output.sessionId = `${channelId}-${nanoid()}`;
        output.customer = await this.customerService.generateCustomer(
          customer,
          contact
        );
        output.newInteraction = false;
      }
      return output;
    } else {
      return null;
    }
  }

  async save(data: InteractionHeader) {
    const repoHeader = getRepository(InteractionHeader);
    return repoHeader.save(data);
  }

  async findAgentAvailable(channelId: string) {
    const entityManager = getManager();
    let data = await entityManager.query(
      "SELECT a.agentUsername,a.slot,a.`limit` FROM work_order a LEFT JOIN user b on a.agentUsername = b.username WHERE a.slot < `limit` and a.channelId = ? and isAux = 0 ORDER BY slot ASC, lastDist ASC LIMIT 1",
      [channelId]
    );

    if (data.length > 0) {
      let updateWorkOrder = new WorkOrder();
      updateWorkOrder.slot = data[0].slot + 1;
      updateWorkOrder.lastDist = new Date();
      const repoWorkOrder = getRepository(WorkOrder);
      repoWorkOrder.update(
        { channelId: channelId, agentUsername: data[0].agentUsername },
        updateWorkOrder
      );
    }
    return data;
  }
}
