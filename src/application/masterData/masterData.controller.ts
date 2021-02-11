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
  GetTemplate,
  AddTemplatePost,
  EditTemplatePut,
  AddUserPost,
  EditUserPut,
  DeleteUser,
  AddWorkOrderPost,
  EditWorkOrderPut,
  AddGroupIdPost,
  EditGroupIdPut,
  AddUnitIdPost,
  EditUnitIdPut,
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

  @Post("getUser")
  @HttpCode(200)
  async getUserPost(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.masterDataService.getUserPost(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("user/add")
  @HttpCode(200)
  async addUser(
    @Request() authData,
    @Body() payload: AddUserPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addUser(payload, authData.user);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("user/edit")
  @HttpCode(200)
  async editUser(
    @Request() authData,
    @Body() payload: EditUserPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editUser(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("user/delete")
  @HttpCode(200)
  async deleteUser(
    @Request() authData,
    @Body() payload: DeleteUser,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteUser(
      payload,
      authData.user
    );
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

  @Post("getMessageTemplate")
  @HttpCode(200)
  async getMessageTemplatePost(
    @Body() payload: GeneralTablePost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.getMessageTemplatePost(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("messageTemplate/add")
  @HttpCode(200)
  async addMessageTemplate(
    @Request() authData,
    @Body() payload: AddTemplatePost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addMessageTemplate(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("messageTemplate/edit")
  @HttpCode(200)
  async editMessageTemplate(
    @Request() authData,
    @Body() payload: EditTemplatePut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editMessageTemplate(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("messageTemplate/delete")
  @HttpCode(200)
  async deleteMessageTemplate(
    @Request() authData,
    @Body() payload: DeleteGeneralPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteMessageTemplate(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("workOrder")
  @HttpCode(200)
  async getWorkOrder(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.masterDataService.getWorkOrderPost(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("workOrder/add")
  @HttpCode(200)
  async addWorkOrder(
    @Request() authData,
    @Body() payload: AddWorkOrderPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addWorkOrder(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("workOrder/edit")
  @HttpCode(200)
  async editWorkOrder(
    @Request() authData,
    @Body() payload: EditWorkOrderPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editWorkOrder(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("groupId")
  @HttpCode(200)
  async getGroupId(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.masterDataService.getGroupIdPost(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("groupId/add")
  @HttpCode(200)
  async addGroupId(
    @Request() authData,
    @Body() payload: AddGroupIdPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addGroupId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("groupId/edit")
  @HttpCode(200)
  async editGroupId(
    @Request() authData,
    @Body() payload: EditGroupIdPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editGroupId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("groupId/delete")
  @HttpCode(200)
  async deleteGroupId(
    @Request() authData,
    @Body() payload: DeleteGeneralPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteGroupId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("unitId")
  @HttpCode(200)
  async getUnitId(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.masterDataService.getUnitIdPost(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("unitId/add")
  @HttpCode(200)
  async addUnitId(
    @Request() authData,
    @Body() payload: AddUnitIdPost,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.addUnitId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("unitId/edit")
  @HttpCode(200)
  async editUnitId(
    @Request() authData,
    @Body() payload: EditUnitIdPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.editUnitId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("unitId/delete")
  @HttpCode(200)
  async deleteUnitId(
    @Request() authData,
    @Body() payload: DeleteGeneralPut,
    @Res() res: Response
  ) {
    const result = await this.masterDataService.deleteUnitId(
      payload,
      authData.user
    );
    res.status(result.statusCode).send(result);
  }

  @Post("ticketStatus")
  @HttpCode(200)
  async getTicketStatus(@Body() payload: GeneralTablePost, @Res() res: Response) {
    const result = await this.masterDataService.getTicketStatusPost(payload);
    res.status(result.statusCode).send(result);
  }
}
