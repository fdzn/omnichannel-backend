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
    this.eventsGateway.jumQueueByChannel();
    if (event.entity.agentUsername != null) {
      this.eventsGateway.sendWorkOrder(event.entity);
    }
  }

  afterUpdate(event: UpdateEvent<InteractionHeader>) {
    if (event.entity) {
      this.eventsGateway.sendWorkOrder(event.entity);
    }
  }

  afterRemove(event: RemoveEvent<InteractionHeader>) {
    this.eventsGateway.jumQueueByChannel();
  }
}
