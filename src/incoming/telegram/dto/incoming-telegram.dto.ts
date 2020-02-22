import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsOptional
} from "class-validator";

export class IncomingTelegram {
  @IsOptional()
  convId: string;

  @IsNotEmpty()
  streamToId: string;

  @IsNotEmpty()
  streamId: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  fromName: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  messageType: string;
}

export class IncomingTelegramResponse {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(2)
  @MaxLength(50)
  userid: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
