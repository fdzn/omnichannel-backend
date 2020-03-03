import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { MasterDataService } from "./masterData.service";

//DTO
import { GetSubCategoryPost } from "./dto/masterData.dto";

@Controller("master")
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Post("getCategory")
  @HttpCode(200)
  async getCategory(@Res() res: Response) {
    const result = await this.masterDataService.getCategory();
    res.status(result.statusCode).send(result);
  }

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
