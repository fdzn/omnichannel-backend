import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
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
    const username = event.entity.agentUsername;
    if (username) {
      this.eventsGateway.sendData(
        `agent:${username}`,
        "newInteractionWhatsapp",
        event.entity
      );
    } else {
      this.eventsGateway.sendData(
        `agent`,
        "newInteractionWhatsapp",
        event.entity
      );
    }

    console.log(`AFTER INTERACTION WHATSAPP INSERTED: `, event.entity);
  }

  afterUpdate(event: UpdateEvent<InteractionWhatsapp>) {
    console.log(`AFTER INTERACTION WHATSAPP UPDATE: `, event.entity);
    const { agentUsername } = event.entity;
    const data = {
      id: event.entity.id,
      sessionId: event.entity.sessionId,
      sendDate: event.entity.sendDate,
      sendStatus: event.entity.sendStatus,
      agentUsername: agentUsername,
      systemMessage: event.entity.systemMessage,
    };

    this.eventsGateway.sendData(
      `agent:${agentUsername}`,
      "updateStatusMessage",
      data
    );
  }
}
