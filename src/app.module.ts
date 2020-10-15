import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Application
import { ApplicationModule } from "./application/application.module";

//Socket
import { EventsModule } from "./sockets/events.module";

//Subscribers
import { SubscribersModule } from "./subscribers/subscribes.module";
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DATABASE_HOST"),
        port: configService.get<number>("DATABASE_PORT"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASS"),
        database: configService.get("DATABASE_SCHEMA"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: configService.get("DATABASE_SYNC") == "1" ? true : false,
      }),
    }),
    ApplicationModule,
    EventsModule,
    SubscribersModule,
  ],
})
export class AppModule {}
