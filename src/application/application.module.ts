import { Module } from "@nestjs/common";

//MODULE
import { AuthModule } from "./auth/auth.module";
import { InteractionModule } from "./interaction/interaction.module";
import { IncomingModule } from "./incoming/incoming.module";
import { OutgoingModule } from "./outgoing/outgoing.module";
import { AutoInModule } from "./autoin/autoin.module";
import { CustomerModule } from "./customer/customer.module";
import { InternalChatModule } from "./internalChat/internalChat.module";
import { MasterDataModule } from "./masterData/masterData.module";
import { ReportModule } from "./report/report.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HeaderModule } from './header/header.module';
import { TicketingModule } from './ticketing/ticketing.module';
@Module({
  imports: [
    AuthModule,
    InteractionModule,
    IncomingModule,
    OutgoingModule,
    CustomerModule,
    AutoInModule,
    MasterDataModule,
    InternalChatModule,
    ReportModule,
    DashboardModule,
    HeaderModule,
<<<<<<< HEAD
    TicketingModule,
  ],
=======
    MonitoringModule
  ]
>>>>>>> 6c29530e0050ec1455126e06c20c77720e99608c
})
export class ApplicationModule {}
