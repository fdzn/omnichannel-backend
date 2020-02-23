import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// Application
// Incoming
import { IncomingModule } from "./incoming/incoming.module";

@Module({
  imports: [TypeOrmModule.forRoot(), IncomingModule]
})
export class AppModule {}
