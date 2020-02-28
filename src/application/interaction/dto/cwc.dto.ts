import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CwcPost {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  agentId: string;

  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  channelId: string;

  @IsNotEmpty()
  @IsInt()
  customerId: number;

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
}
