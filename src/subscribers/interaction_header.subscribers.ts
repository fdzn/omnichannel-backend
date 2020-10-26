import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import { EventsGateway } from "../sockets/events.gateway";

//ENTITY
import { InteractionHeader } from "../entity/interaction_header.entity";

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
    this.eventsGateway.jumQueueByChannel();
  }

  afterUpdate(event: UpdateEvent<InteractionHeader>) {
    console.log(`AFTER INTERACTION HEADER UPDATE: `, event.entity);
    if (event.entity) {
      this.eventsGateway.sendWorkOrder(event.entity);
    }
  }

  afterRemove(event: RemoveEvent<InteractionHeader>) {
    console.log(`AFTER INTERACTION HEADER REMOVE: `, event);
    this.eventsGateway.jumQueueByChannel();
  }
}
