import { IsNotEmpty, IsBoolean } from "class-validator";

export class UpdateAuxPost {
  @IsNotEmpty()
  username: string;

  @IsBoolean()
  auxStatus: boolean;
}
