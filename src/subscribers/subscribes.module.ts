import { Module } from "@nestjs/common";
import { InteractionWhatsappSubscriber } from "./interaction_whatsapp.subscribers";
import { InteractionHeaderSubscriber } from "./interaction_header.subscribers";
import { EventsModule } from "../sockets/events.module";
@Module({
  imports: [EventsModule],
  providers: [InteractionHeaderSubscriber, InteractionWhatsappSubscriber]
})
export class SubscribersModule {}
