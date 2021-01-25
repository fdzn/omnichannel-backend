import { Module } from "@nestjs/common";

//COMPONENT
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
