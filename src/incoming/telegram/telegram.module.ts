import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TelegramService } from "./telegram.service";
import { TelegramController } from "./telegram.controller";
import { LibsModule } from "../../libs/libs.module";

// Schemas
import { InteractionSchema } from "../../schemas/interaction.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Interaction", schema: InteractionSchema }
    ]),
    LibsModule
  ],
  controllers: [TelegramController],
  providers: [TelegramService]
})
export class TelegramModule {}
