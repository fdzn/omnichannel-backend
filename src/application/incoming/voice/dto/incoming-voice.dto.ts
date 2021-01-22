import { IsNotEmpty, IsOptional } from "class-validator";
import { Customer } from "../../../../entity/customer.entity";
import { ContactData } from "../../../../dto/app.dto";
export class AsteriskPost {
  @IsNotEmpty()
  phone: string;
  @IsOptional()
  name: string;
  @IsNotEmpty()
  agentId: string;
}

export class IncomingVoice {
  from: string;
  fromName: string;
  agentUsername: string;
  contact: ContactData;
  customer: Customer;
}
