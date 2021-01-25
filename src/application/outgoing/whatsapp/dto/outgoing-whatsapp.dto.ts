import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class OutgoingWhatsapp {
  @IsNotEmpty()
  sessionId: string;

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

  @IsOptional()
  @IsDateString()
  lastDate: Date;
}
