import { IsEnum, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export enum StatusCall {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export class CwcPost {
  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  channelId: string;

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

  @IsOptional()
  @IsEnum(StatusCall)
  type: StatusCall;
}
