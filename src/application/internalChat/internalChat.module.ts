import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//COMPONENT
import { InternalChatService } from "./internalChat.service";
import { InternalChatController } from "./internalChat.controller";

//ENTITY
import { InternalChat } from "../../entity/internal_chat.entity";
import { User } from "../../entity/user.entity";
@Module({
  imports: [TypeOrmModule.forFeature([InternalChat, User])],
  providers: [InternalChatService],
  controllers: [InternalChatController],
})
export class InternalChatModule {}
