import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

//ENTITY
import { Ticket } from "../entity/ticket.entity";

//SERVICE
import { TicketingService } from "../application/ticketing/ticketing.service";

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    connection: Connection,
    private readonly ticketingService: TicketingService
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Ticket;
  }

  afterInsert(event: InsertEvent<Ticket>) {
    if (event.metadata.targetName !== "Ticket") {
      return;
    }

    this.ticketingService.createHistory(event.entity);
  }

  afterUpdate(event: UpdateEvent<Ticket>) {
    if (event.metadata.targetName !== "Ticket") {
      return;
    }
    if (event.entity) {
      this.ticketingService.createHistory(event.entity);
    }
  }
}
