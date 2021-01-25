import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class OutgoingWebchat {
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
  @IsDate()
  lastDate: Date;
}
