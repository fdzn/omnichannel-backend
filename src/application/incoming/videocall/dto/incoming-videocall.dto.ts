import { IsNotEmpty } from "class-validator";
import { Customer } from "../../../../entity/customer.entity";
import { ContactApp } from "../../../../dto/app.dto";
export class VonagePost {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  apiKey: string;

  @IsNotEmpty()
  library: string;

  @IsNotEmpty()
  socketId: string;
}

export class IncomingVideoCall {
  from: string;
  fromName: string;
  sessionVideo: string;
  roomId: string;
  apiKey: string;
  token: string;
  library: string;
  socketId: string;
  message: string;
  contact: ContactApp[];
  customer: Customer;
}
