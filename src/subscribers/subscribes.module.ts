import { Module } from "@nestjs/common";

//COMPONENT
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { InteractionHeaderHistorySubscriber } from "./interaction_header_history.subscribers";
import { InteractionChatSubscriber } from "./interaction_chat.subscribers";
import { InternalChatSubscribers } from "./internal_chat.subscribers";

import { EventsModule } from "../sockets/events.module";

@Module({
  imports: [EventsModule],
  providers: [
    InteractionHeaderSubscriber,
    InteractionHeaderHistorySubscriber,
    InternalChatSubscribers,
    InteractionChatSubscriber,
  ],
})
export class SubscribersModule {}
