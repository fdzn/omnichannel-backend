import { Controller, Get, Post,Res, Body } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthLogin,AuthLogout } from "./dto/auth-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() userData: AuthLogin, @Res() res: Response) {
    const result = await this.authService.login(userData);
    res.status(result.statusCode).send(result);
  }

  @Post("logout")
  async logout(@Body() userData: AuthLogout, @Res() res: Response) {
    const result = await this.authService.logout(userData);
    res.status(result.statusCode).send(result);
  }
}
