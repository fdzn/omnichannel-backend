import { Module } from "@nestjs/common";

//COMPONENT
import { InteractionWhatsappSubscriber } from "./interaction_whatsapp.subscribers";
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { InternalChatSubscribers } from "./internal_chat.subscribers";

import { EventsModule } from "../sockets/events.module";

@Module({
  imports: [EventsModule],
  providers: [
    InteractionHeaderSubscriber,
    InteractionWhatsappSubscriber,
    InternalChatSubscribers
  ]
})
export class SubscribersModule {}
