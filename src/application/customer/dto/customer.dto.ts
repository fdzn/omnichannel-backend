import { IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class GetCustomerDetailPost {
  @IsNotEmpty()
  @IsInt()
  custId: number;
}
