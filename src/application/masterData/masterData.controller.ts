import { Controller, Post, Res, Body, HttpCode,UseGuards } from "@nestjs/common";
import { Response } from "express";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { MasterDataService } from "./masterData.service";

//DTO
import { GetSubCategoryPost } from "./dto/masterData.dto";

@Controller("master")
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @UseGuards(JwtAuthGuard)
  @Post("getCategory")
  @HttpCode(200)
  async getCategory(@Res() res: Response) {
    const result = await this.masterDataService.getCategory();
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("getSubCategory")
  @HttpCode(200)
  async getSubCategory(
    @Body() postData: GetSubCategoryPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.getSubCategory(postData);
    res.status(result.statusCode).send(result);
  }
}
