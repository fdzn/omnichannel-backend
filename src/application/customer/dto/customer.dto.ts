import { IsNotEmpty, IsInt, IsString } from "class-validator";

export class UpdateCustomerByKeyPut {
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

export class UpdateCustomerPut {
  name: string;
  gender: string;
  address: string;
  city: string;
  company: string;
  phone: string;
  email: string;
  telegram: string;
  priority: number;
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
