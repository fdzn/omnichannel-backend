import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutoInService } from "./autoin.service";
import { AutoInController } from "./autoin.controller";
// import { LibsModule } from "../../libs/libs.module";
import { User } from "../../entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AutoInService],
  controllers: [AutoInController]
})
export class AutoInModule {}
