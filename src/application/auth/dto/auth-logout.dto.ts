import { IsNotEmpty } from "class-validator";

export class AuthLogout {
  @IsNotEmpty()
  username: string;
}
