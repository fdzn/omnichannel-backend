import {
  Connection,
  getRepository,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

//ENTITY
import { InteractionHeaderHistory } from "../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../entity/interaction_header_history_today.entity";

@EventSubscriber()
export class InteractionHeaderHistorySubscriber
  implements EntitySubscriberInterface<InteractionHeaderHistory> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InteractionHeaderHistory;
  }

  afterInsert(event: InsertEvent<InteractionHeaderHistory>) {
    if (event.metadata.targetName !== "InteractionHeaderHistory") {
      return;
    }

    const repoToday = getRepository(InteractionHeaderHistoryToday);
    repoToday.save(event.entity);
  }
}
