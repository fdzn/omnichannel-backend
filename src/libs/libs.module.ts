import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionService } from "./services/session.service";
import { CustomerService } from "./services/customer.service";

// Entity
import { InteractionHeader } from "../entity/interaction_header.entity";
import { Contact } from "../entity/contact.entity";
import { Customer } from "../entity/customer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InteractionHeader, Contact, Customer])],
  exports: [SessionService, CustomerService],
  controllers: [],
  providers: [SessionService, CustomerService]
})
export class LibsModule {}
