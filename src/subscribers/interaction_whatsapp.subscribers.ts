import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from "typeorm";
import { InteractionWhatsapp } from "../entity/interaction_whatsapp.entity";
import { EventsGateway } from "../sockets/events.gateway";
@EventSubscriber()
export class InteractionWhatsappSubscriber
  implements EntitySubscriberInterface<InteractionWhatsapp> {
  constructor(
    connection: Connection,
    private readonly eventsGateway: EventsGateway
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InteractionWhatsapp;
  }

  afterInsert(event: InsertEvent<InteractionWhatsapp>) {
    this.eventsGateway.sendData(
      "agent",
      "newInteraction:whatsapp",
      event.entity
    );
    console.log(`AFTER INTERACTION WHATSAPP INSERTED: `, event.entity);
  }
}
