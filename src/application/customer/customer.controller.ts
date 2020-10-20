import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  HttpCode,
  UseGuards,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

//GUARD
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

//SERVICES
import { CustomerService } from "./customer.service";

//DTO
import { GetCustomerDetailPost } from "./dto/customer.dto";

@ApiTags("Customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":custId")
  @HttpCode(200)
  async getById(
    @Param("custId") custId: number,

    @Res() res: Response
  ) {
    let param = new GetCustomerDetailPost();
    param.custId = custId;
    const result = await this.customerService.getById(param);
    res.status(result.statusCode).send(result);
  }
}
