import {
  Controller,
  Post,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";

//GUARD
import { LocalAuthGuard } from "./local.auth.guard";
import { JwtAuthGuard } from "./jwt.auth.guard";
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
  async logout(
    @Request() payload,
    @Res() res: Response
  ) {
    const result = await this.authService.logout(payload);
    res.status(result.statusCode).send(result);
  }
}
