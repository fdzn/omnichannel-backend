import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from "typeorm";
import { EventsGateway } from "../sockets/events.gateway";

//ENTITY
import { InternalChat } from "../entity/internal_chat.entity";
@EventSubscriber()
export class InternalChatSubscribers
  implements EntitySubscriberInterface<InternalChat> {
  constructor(
    connection: Connection,
    private readonly eventsGateway: EventsGateway
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InternalChat;
  }

  afterInsert(event: InsertEvent<InternalChat>) {
    this.eventsGateway.sendData(
      "agent",
      "newInteractionInternalChat",
      event.entity
    );
    console.log(`AFTER INTERACTION INTERNAL CHAT INSERTED: `, event.entity);
  }
}
