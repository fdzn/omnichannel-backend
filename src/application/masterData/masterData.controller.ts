import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Body,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { MasterDataService } from "./masterData.service";

//DTO
import { GetSubCategoryPost, GeneralTablePost } from "./dto/masterData.dto";

@ApiBearerAuth()
@ApiTags("Master")
@Controller("master")
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @UseGuards(JwtAuthGuard)
  @Get("getUser")
  @HttpCode(200)
  async getUser(@Res() res: Response) {
    const result = await this.masterDataService.getUser();
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getCategory")
  @HttpCode(200)
  async getCategory(@Res() res: Response) {
    const result = await this.masterDataService.getCategory();
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getSubCategory/:categoryId")
  @HttpCode(200)
  async getSubCategory(
    @Param("categoryId") categoryId: number,
    @Res() res: Response
  ) {
    let params = new GetSubCategoryPost();
    params.categoryId = categoryId;
    const result = await this.masterDataService.getSubCategory(params);
    res.status(result.statusCode).send(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Post("getCategory")
  @HttpCode(200)
  async getCategoryPost(
    @Body() payload: GeneralTablePost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.getCategoryPost(payload);
    res.status(result.statusCode).send(result);
  }

  @Post("getSubCategory")
  @HttpCode(200)
  async getSubCategoryPost(
    @Body() payload: GeneralTablePost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.getSubCategoryPost(payload);
    res.status(result.statusCode).send(result);
  }
}
