import { Controller, Get, Post, Res, Body } from "@nestjs/common";
import { Response } from "express";

//SERVICES
import { AuthService } from "./auth.service";

//DTO
import { AuthLogin } from "./dto/auth-login.dto";
import { AuthLogout } from "./dto/auth-logout.dto";

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
