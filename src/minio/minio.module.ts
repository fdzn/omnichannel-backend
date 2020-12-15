import { Module, HttpModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LibsModule } from "../application/libs/libs.module";
import { MinioModule } from "nestjs-minio-client";
import { MinioController } from "./minio.controller";
import { MinioNestService } from "./minio.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT,
      useSSL: process.env.MINIO_SSL == "1" ? true : false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    }),
    HttpModule,
    LibsModule,
  ],
  controllers: [MinioController],
  providers: [MinioNestService],
  exports: [MinioNestService],
})
export class MinioNestModule {}
