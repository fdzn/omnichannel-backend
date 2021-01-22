import { Module } from "@nestjs/common";

//COMPONENT
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

//MODULE
import { HeaderModule } from "../../header/header.module";
import { MinioNestModule } from "../../../minio/minio.module";

@Module({
  imports: [HeaderModule, MinioNestModule],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
