import { Module, HttpModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//SERVICES
import { LibsService } from "./services/lib.service";
import { SessionService } from "./services/session.service";
import { CustomerService } from "./services/customer.service";
import { InteractionLibService } from "./services/interaction.service";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../../entity/interaction_header_history_today.entity";
import { InteractionVideoCall } from "../../entity/interaction_videocall.entity";
import { InteractionVideoCallHistory } from "../../entity/interaction_videocall_history.entity";
import { InteractionChat } from "../../entity/interaction_chat.entity";
import { InteractionChatHistory } from "../../entity/interaction_chat_history.entity";
import { WorkOrder } from "../../entity/work_order.entity";
import { Contact } from "../../entity/contact.entity";
import { Customer } from "../../entity/customer.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      InteractionHeader,
      InteractionHeaderHistory,
      InteractionHeaderHistoryToday,
      InteractionVideoCall,
      InteractionVideoCallHistory,
      InteractionChat,
      InteractionChatHistory,
      Contact,
      Customer,
      WorkOrder,
    ]),
  ],
  exports: [
    LibsService,
    SessionService,
    CustomerService,
    InteractionLibService,
  ],
  controllers: [],
  providers: [
    LibsService,
    SessionService,
    CustomerService,
    InteractionLibService,
  ],
})
export class LibsModule {}
