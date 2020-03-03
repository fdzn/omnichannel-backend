import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// Application
import { ApplicationModule } from "./application/application.module";

//Socket
import { EventsModule } from "./sockets/events.module";

//Subscribers
import { SubscribersModule } from "./subscribers/subscribes.module";
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ApplicationModule,
    EventsModule,
    SubscribersModule
  ]
})
export class AppModule {}
