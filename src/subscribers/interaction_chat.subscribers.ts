import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { EventsGateway } from "../sockets/events.gateway";

//ENTITY
import { InteractionChat } from "../entity/interaction_chat.entity";
@EventSubscriber()
export class InteractionChatSubscriber
  implements EntitySubscriberInterface<InteractionChat> {
  constructor(
    connection: Connection,
    private readonly eventsGateway: EventsGateway
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return InteractionChat;
  }

  afterInsert(event: InsertEvent<InteractionChat>) {
    if (event.metadata.targetName !== "InteractionChat") {
      return;
    }
    const username = event.entity.agentUsername;
    if (username) {
      const channelId = event.entity.channelId;
      const nameCapitalized =
        channelId.charAt(0).toUpperCase() + channelId.slice(1);
      this.eventsGateway.sendData(
        `agent:${username}`,
        `newInteraction${nameCapitalized}`,
        event.entity
      );
    }
  }

  afterUpdate(event: UpdateEvent<InteractionChat>) {
    if (event.metadata.targetName !== "InteractionChat") {
      return;
    }
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
