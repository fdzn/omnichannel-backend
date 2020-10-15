import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

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
        host: configService.get("DATABASE_HOST", "localhost"),
        port: configService.get<number>("DATABASE_PORT", 3306),
        username: configService.get("DATABASE_USER", "root"),
        password: configService.get("DATABASE_PASS", ""),
        database: configService.get("DATABASE_SCHEMA", "sim_mobile"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: configService.get("DATABASE_SYNC") == "1" ? true : false,
      }),
    }),
    ApplicationModule,
    EventsModule,
    SubscribersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
