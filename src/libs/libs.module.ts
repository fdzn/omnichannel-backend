import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionService } from "./services/session.service";
import { CustomerService } from "./services/customer.service";

// Schemas
import { SessionSchema } from "../schemas/session.schema";
import { CustomerSchema } from "../schemas/customer.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Session", schema: SessionSchema },
      { name: "Customer", schema: CustomerSchema }
    ])
  ],
  exports: [SessionService, CustomerService],
  controllers: [],
  providers: [SessionService, CustomerService]
})
export class LibsModule {}
