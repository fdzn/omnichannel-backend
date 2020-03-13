import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class SendPost {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  media: string;
}

export class GetChatPost {
  @IsNotEmpty()
  to: string;
  
  @IsNotEmpty()
  @IsInt()
  page: number;
}
