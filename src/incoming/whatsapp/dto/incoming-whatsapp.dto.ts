import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class IncomingWhatsapp {
  @IsNotEmpty()
  from: string;

  @IsOptional()
  fromName: string;

  @IsOptional()
  convId: string;

  @IsOptional()
  message: string;

  @IsOptional()
  media: string;
}

export class IncomingWhatsappResponse {
  @IsNotEmpty()
  isError: boolean;

  @IsNotEmpty()
  data: string;

  @IsNotEmpty()
  @IsInt()
  statusCode: number;
}
