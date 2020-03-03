import { IsNotEmpty } from "class-validator";

export class AuthLogin {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
