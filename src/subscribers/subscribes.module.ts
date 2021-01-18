import { Module } from "@nestjs/common";

//COMPONENT
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { InteractionChatSubscriber } from "./interaction_chat.subscribers";
import { InternalChatSubscribers } from "./internal_chat.subscribers";

import { EventsModule } from "../sockets/events.module";

@Module({
  imports: [EventsModule],
  providers: [
    InteractionHeaderSubscriber,
    InternalChatSubscribers,
    InteractionChatSubscriber,
  ],
})
export class SubscribersModule {}
