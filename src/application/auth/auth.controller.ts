import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";

//GUARD
import { LocalAuthGuard } from "./guards/local.auth.guard";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";
//SERVICES
import { AuthService } from "./auth.service";

//DTO
import { AuthLogin } from "./dto/auth-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  async login(@Body() userData: AuthLogin, @Res() res: Response) {
    const result = await this.authService.login(userData.username);
    res.status(200).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(200)
  async logout(@Request() payload, @Res() res: Response) {
    const result = await this.authService.logout(payload);
    res.status(result.statusCode).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get("isLogin")
  @HttpCode(200)
  getDetailLogin(@Request() payload, @Res() res: Response) {
    console.log(payload)
    const result = {
      isError: false,
      data: payload.user,
      statusCode: 200,
    };
    res.status(result.statusCode).send(result);
  }
}
