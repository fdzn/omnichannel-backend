import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class SendPost {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  media: string;
}

export class GetChatPost {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
  @IsNotEmpty()
  @IsInt()
  page: number;
}
