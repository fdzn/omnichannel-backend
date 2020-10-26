import { IsNotEmpty, IsInt, IsString } from "class-validator";

export class GetCustomerDetailPost {
  @IsNotEmpty()
  @IsInt()
  custId: number;
}

export class UpdateCustomerPut {
  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class UpdateContactPut {
  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsNotEmpty()
  @IsInt()
  idContact: number;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class AddContactPost {
  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
