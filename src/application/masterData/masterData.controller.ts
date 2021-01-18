import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
  Put,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { MasterDataService } from "./masterData.service";

//DTO
import {
  GetSubCategoryPost,
  GeneralTablePost,
  AddCategoryPost,
  EditCategoryPut,
  DeleteGeneralPut,
  AddSubCategoryPost,
  EditSubCategoryPut,
  GetTemplate
} from "./dto/masterData.dto";

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

  @UseGuards(JwtAuthGuard)
  @Post("category/add")
  @HttpCode(200)
  async addCategory(
    @Request() authData,
    @Body() payload: AddCategoryPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("category/edit")
  @HttpCode(200)
  async editCategory(
    @Request() authData,
    @Body() payload: EditCategoryPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("category/delete")
  @HttpCode(200)
  async deleteCategory(
    @Request() authData,
    @Body() payload: DeleteGeneralPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("subCategory/add")
  @HttpCode(200)
  async subCategory(
    @Request() authData,
    @Body() payload: AddSubCategoryPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addSubCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("subCategory/edit")
  @HttpCode(200)
  async editSubCategory(
    @Request() authData,
    @Body() payload: EditSubCategoryPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editSubCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("subCategory/delete")
  @HttpCode(200)
  async deleteSubCategory(
    @Request() authData,
    @Body() payload: DeleteGeneralPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteSubCategory(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getMessageTemplate/:templateType/:limit")
  @HttpCode(200)
  async getMessageTemplate(
    @Param("templateType") templateType: string,
    @Param("limit") limit: number,
    @Res() res: Response
  ) {
    let params = new GetTemplate();
    params.templateType = templateType;
    params.limit = limit;
    const result = await this.masterDataService.getMessageTemplate(params);
    res.status(result.statusCode).send(result);
  }
}
