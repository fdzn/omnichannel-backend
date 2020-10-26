import {
  Controller,
  Get,
  Post,
  Put,
  Res,
  Body,
  HttpCode,
  UseGuards,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { CustomerService } from "./customer.service";

//DTO
import {
  AddContactPost,
  GetCustomerDetailPost,
  UpdateContactPut,
  UpdateCustomerPut,
} from "./dto/customer.dto";

@ApiBearerAuth()
@ApiTags("Customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":custId")
  @HttpCode(200)
  async getById(@Param("custId") custId: number, @Res() res: Response) {
    let param = new GetCustomerDetailPost();
    param.custId = custId;
    const result = await this.customerService.getById(param);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("update")
  @HttpCode(200)
  async update(@Body() dataPost: UpdateCustomerPut, @Res() res: Response) {
    const result = await this.customerService.updateCustomer(dataPost);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put("updateContact")
  @HttpCode(200)
  async updateContact(
    @Body() dataPost: UpdateContactPut,
    @Res() res: Response
  ) {
    const result = await this.customerService.updateContact(dataPost);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("addContact")
  @HttpCode(200)
  async addContact(@Body() dataPost: AddContactPost, @Res() res: Response) {
    const result = await this.customerService.addContact(dataPost);
    res.status(result.statusCode).send(result);
  }
}
