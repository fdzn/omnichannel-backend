import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsOptional
} from "class-validator";

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

// export class IncomingTelegramResponse {
//   @IsNotEmpty()
//   id: string;

//   @IsNotEmpty()
//   @IsAlphanumeric()
//   @MinLength(2)
//   @MaxLength(50)
//   userid: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(2)
//   @MaxLength(50)
//   name: string;

//   @IsEmail()
//   email: string;

//   createdAt: Date;

//   updatedAt: Date;
// }
