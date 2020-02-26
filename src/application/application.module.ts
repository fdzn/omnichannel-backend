import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
@Module({
  imports: [AuthModule, InteractionModule]
})
export class ApplicationModule {}
