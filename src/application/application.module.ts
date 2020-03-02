import { Module } from "@nestjs/common";

//MODULE
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
import { IncomingModule } from "./incoming/incoming.module";
import { OutgoingModule } from "./outgoing/outgoing.module";
import { AutoInModule } from "./autoin/autoin.module";
import { CustomerModule } from "./customer/customer.module";
import { InternalChatModule } from "./internalChat/internalChat.module";
@Module({
  imports: [
    AuthModule,
    InteractionModule,
    IncomingModule,
    OutgoingModule,
    CustomerModule,
    AutoInModule,
    InternalChatModule
  ]
})
export class ApplicationModule {}
