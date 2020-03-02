import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";
import { Customer } from "../../entity/customer.entity";
import { Contact } from "../../entity/contact.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Customer])],
  providers: [CustomerService],
  controllers: [CustomerController]
})
export class CustomerModule {}
