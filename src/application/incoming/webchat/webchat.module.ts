import { Module } from "@nestjs/common";

import { WebchatService } from "./webchat.service";
import { WebchatController } from "./webchat.controller";

//MODULE
import { HeaderModule } from "../../header/header.module";
import { MinioNestModule } from "../../../minio/minio.module";

@Module({
  imports: [HeaderModule, MinioNestModule],
  providers: [WebchatService],
  controllers: [WebchatController],
})
export class WebchatModule {}
