import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsOptional
} from "class-validator";

export class AuthLogin {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class AuthLogout {
  @IsNotEmpty()
  username: string;
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
