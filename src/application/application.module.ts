import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
import { IncomingModule } from "./incoming/incoming.module";
import { OutgoingModule } from "./outgoing/outgoing.module";
import { AutoInModule } from "./autoin/autoin.module";
@Module({
  imports: [AuthModule, InteractionModule, IncomingModule,OutgoingModule, AutoInModule]
})
export class ApplicationModule {}
