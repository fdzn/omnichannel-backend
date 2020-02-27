import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent
} from "typeorm";
import { InteractionHeader } from "../entity/interaction_header.entity";
import { EventsGateway } from "../sockets/events.gateway";
@EventSubscriber()
export class InteractionHeaderSubscriber
  implements EntitySubscriberInterface<InteractionHeader> {
  constructor(
    connection: Connection,
    private readonly eventsGateway: EventsGateway
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InteractionHeader;
  }

  afterInsert(event: InsertEvent<InteractionHeader>) {
    console.log(`AFTER INTERACTION HEADER INSERTED: `, event.entity);
  }

  afterUpdate(event: UpdateEvent<InteractionHeader>) {
    console.log(`AFTER INTERACTION HEADER UPDATE: `, event.entity);
    if (event.entity) {
      this.eventsGateway.sendData(
        `agent:${event.entity.agentUsername}`,
        "newQueue",
        event.entity
      );
    }
  }

  afterRemove(event: RemoveEvent<InteractionHeader>) {
    console.log(`AFTER INTERACTION HEADER REMOVE: `, event);
  }
}
