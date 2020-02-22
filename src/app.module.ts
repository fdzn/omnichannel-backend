import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
// Application
// Incoming
import { IncomingModule } from "./incoming/incoming.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      "mongodb://admin@localhost:27017/on5-demo?authSource=admin",
      {}
    ),
    IncomingModule
  ]
})
export class AppModule {}
