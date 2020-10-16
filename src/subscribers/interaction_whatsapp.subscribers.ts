import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from "typeorm";
import { EventsGateway } from "../sockets/events.gateway";

//ENTITY
import { InteractionWhatsapp } from "../entity/interaction_whatsapp.entity";
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
      "newInteractionWhatsapp",
      event.entity
    );
    console.log(`AFTER INTERACTION WHATSAPP INSERTED: `, event.entity);
  }
}
