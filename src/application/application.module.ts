import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
import { IncomingModule } from "./incoming/incoming.module";
import { AutoInModule } from "./autoin/autoin.module";
@Module({
  imports: [AuthModule, InteractionModule, IncomingModule, AutoInModule]
})
export class ApplicationModule {}
