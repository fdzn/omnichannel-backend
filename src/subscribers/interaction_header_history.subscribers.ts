import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

//ENTITY
import { InteractionHeaderHistory } from "../entity/interaction_header_history.entity";
import { InteractionLibService } from "../application/libs/services/interaction.service";
@EventSubscriber()
export class InteractionHeaderHistorySubscriber
  implements EntitySubscriberInterface<InteractionHeaderHistory> {
  constructor(
    connection: Connection,
    private readonly InteractionLibService: InteractionLibService
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InteractionHeaderHistory;
  }

  afterInsert(event: InsertEvent<InteractionHeaderHistory>) {
    if (event.metadata.targetName !== "InteractionHeaderHistory") {
      return;
    }
    this.InteractionLibService.moveToTableToday(event.entity);
  }
}
