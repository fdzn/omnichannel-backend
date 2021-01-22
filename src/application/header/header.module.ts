import { Module } from "@nestjs/common";
import { HeaderService } from "./header.service";
import { CustomerModule } from "../customer/customer.module";
@Module({
  imports: [CustomerModule],
  providers: [HeaderService],
  exports: [HeaderService],
})
export class HeaderModule {}
