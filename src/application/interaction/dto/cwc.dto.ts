import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from "class-validator";

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
  statusCall: StatusCall;

  @IsBoolean()
  @IsNotEmpty()
  createTicket: boolean;
}
