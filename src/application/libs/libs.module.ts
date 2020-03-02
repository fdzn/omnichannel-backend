import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

//SERVICES
import { SessionService } from "./services/session.service";
import { CustomerService } from "./services/customer.service";
import { InteractionLibService } from "./services/interaction.service";

//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionWhatsapp } from "../../entity/interaction_whatsapp.entity";
import { InteractionWhatsappHistory } from "../../entity/interaction_whatsapp_history.entity";
import { Contact } from "../../entity/contact.entity";
import { Customer } from "../../entity/customer.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InteractionHeader,
      InteractionWhatsapp,
      InteractionWhatsappHistory,
      Contact,
      Customer
    ])
  ],
  exports: [SessionService, CustomerService, InteractionLibService],
  controllers: [],
  providers: [SessionService, CustomerService, InteractionLibService]
})
export class LibsModule {}
