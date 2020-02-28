import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CwcPost {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsInt()
  subcategoryId: number;

  @IsOptional()
  remark: string;
  @IsOptional()
  feedback: string;

  @IsOptional()
  @IsInt()
  sentiment: number;

  @IsNotEmpty()
  username: string;
}
