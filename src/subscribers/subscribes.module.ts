import { Module } from "@nestjs/common";

//COMPONENT
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { InteractionChatSubscriber } from "./interaction_chat.subscribers";
import { InternalChatSubscribers } from "./internal_chat.subscribers";

import { EventsModule } from "../sockets/events.module";
import { LibsModule } from "../application/libs/libs.module";

@Module({
  imports: [EventsModule, LibsModule],
  providers: [
    InteractionHeaderSubscriber,
    InternalChatSubscribers,
    InteractionChatSubscriber,
  ],
})
export class SubscribersModule {}
