import { Module } from "@nestjs/common";

//COMPONENT
import { InternalChatService } from "./internalChat.service";
import { InternalChatController } from "./internalChat.controller";

@Module({
  providers: [InternalChatService],
  controllers: [InternalChatController],
})
export class InternalChatModule {}
