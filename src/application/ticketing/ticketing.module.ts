import { Module } from "@nestjs/common";
import { TicketingService } from "./ticketing.service";
import { TicketingController } from "./ticketing.controller";

@Module({
  providers: [TicketingService],
  controllers: [TicketingController],
  exports: [TicketingService],
})
export class TicketingModule {}
