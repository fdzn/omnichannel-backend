import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// Application
// Incoming
import { IncomingModule } from "./incoming/incoming.module";
import { ApplicationModule } from "./application/application.module";

@Module({
  imports: [TypeOrmModule.forRoot(), IncomingModule, ApplicationModule]
})
export class AppModule {}
