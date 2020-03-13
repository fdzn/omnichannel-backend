import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const validateResult = await this.authService.validateUser(
      username,
      password
    );
    if (validateResult.isError) {
      throw new UnauthorizedException();
    }
    return validateResult.data;
  }
}
