import { Module } from "@nestjs/common";

//COMPONENT
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { InteractionHeaderHistorySubscriber } from "./interaction_header_history.subscribers";
import { InteractionChatSubscriber } from "./interaction_chat.subscribers";
import { InternalChatSubscribers } from "./internal_chat.subscribers";
import { TicketSubscriber } from "./ticket.subscribers";

import { EventsModule } from "../sockets/events.module";
import { TicketingModule } from "../application/ticketing/ticketing.module";

@Module({
  imports: [EventsModule, TicketingModule],
  providers: [
    InteractionHeaderSubscriber,
    InteractionHeaderHistorySubscriber,
    InternalChatSubscribers,
    InteractionChatSubscriber,
    TicketSubscriber,
  ],
})
export class SubscribersModule {}
