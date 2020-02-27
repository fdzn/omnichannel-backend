import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
import { IncomingModule } from "./incoming/incoming.module";
@Module({
  imports: [AuthModule, InteractionModule, IncomingModule]
})
export class ApplicationModule {}
