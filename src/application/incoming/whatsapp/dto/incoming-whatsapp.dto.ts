import { IsNotEmpty, IsOptional } from "class-validator";

export class IncomingWhatsapp {
  @IsNotEmpty()
  from: string;

  @IsOptional()
  fromName: string;

  @IsOptional()
  convId: string;

  @IsOptional()
  message: string;

  @IsNotEmpty()
  messageType: string;

  @IsOptional()
  media: string;

  @IsOptional()
  account: string;
}

export class CapiwhaPost {
  @IsNotEmpty()
  data: string;
}
